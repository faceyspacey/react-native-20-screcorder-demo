'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Animated,
  StatusBarIOS,
  TouchableOpacity,
  TouchableWithoutFeedback,
  NavigatorIOS
} from 'react-native';

import Video from 'react-native-video';
import Recorder from 'react-native-screcorder';
import styles from './style';
import Dimensions from 'Dimensions';

var screen = Dimensions.get('window');



class MyVideoRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: "front",
      flash: false,
      recording: false,
      nbSegments: 0,
      barPosition: new Animated.Value(0),
      currentDuration: 0,
      maxDuration: 10000,
      limitReached: false,
      config: {
        flashMode: Recorder.constants.SCFlashModeOff,
        video: {
          enabled: true,
          format: 'MPEG4',
          bitrate: 2000000,
          timescale: 1,
          quality: "HighestQuality",
        },
        audio: {
          enabled: true,
          bitrate: 128000, // 128kbit/s
          channelsCount: 1, // Mono output
          format: "MPEG4AAC",
          quality: "HighestQuality" // HighestQuality || MediumQuality || LowQuality
        }
      }
    };
  }


  componentDidMount() {
    StatusBarIOS.setHidden(true, "slide");
  }

  /*
   *  PRIVATE METHODS
   */

  startBarAnimation() {
    this.animRunning = true;
    this.animBar = Animated.timing(
      this.state.barPosition,
      {
        toValue: screen.width,
        duration: this.state.maxDuration - this.state.currentDuration
      }
    );
    this.animBar.start(() => {
      // The video duration limit has been reached
      if (this.animRunning) {
        this.finish();
      }
    });
  }

  resetBarAnimation() {
    Animated.spring(this.state.barPosition, {toValue: 0}).start();
  }

  stopBarAnimation() {
    this.animRunning = false;
    if (this.animBar)
      this.animBar.stop();
  }

  /*
   *  PUBLIC METHODS
   */

  toggleRecord() {
    if(this.state.recording) this.pause();
    else this.record();
  }

  record() {
    if (this.state.limitReached) return;
    this.refs.recorder.record();
    this.startBarAnimation();
    this.setState({recording: true});
  }

  pause() {
    if (!this.state.recording) return;
    this.refs.recorder.pause();
    this.stopBarAnimation();
    this.setState({recording: false, nbSegments: ++this.state.nbSegments});
  }

  finish() {
    this.stopBarAnimation();
    this.refs.recorder.pause();
    this.setState({recording: false, limitReached: true, nbSegments: ++this.state.nbSegments});
  }

  reset() {
    this.resetBarAnimation();
    this.refs.recorder.removeAllSegments();
    this.setState({
      recording: false,
      nbSegments: 0,
      currentDuration: 0,
      limitReached: false
    });
  }

  preview() {
    this.refs.recorder.save((err, url) => {
      console.log('url = ', url);
      this.props.navigator.push({component: Preview, passProps: {video: url}});
    });
  }

  setDevice() {
    var device = (this.state.device == "front") ? "back" : "front";
    this.setState({device: device});
  }

  //flash toggling not currently working.
  //see issue: https://github.com/maxs15/react-native-screcorder/issues/26
  toggleFlash() {
    if (this.state.config.flashMode == Recorder.constants.SCFlashModeOff) {
      this.state.config.flashMode = Recorder.constants.SCFlashModeLight;
    } else {
      this.state.config.flashMode = Recorder.constants.SCFlashModeOff;
    }

    this.setState({config: this.state.config});
  }

  /*
   *  EVENTS
   */

  onRecordDone() {
    this.setState({nbSegments: 0});
  }

  onNewSegment(segment) {
    console.log('segment = ', segment);
    this.state.currentDuration += segment.duration * 1000;
  }

  renderBar() {
    return (
      <View style={styles.barWrapper}>
        <Animated.View style={[styles.barGauge, {width: this.state.barPosition}]}/>
      </View>
    );
  }

  render() {
    var bar     = this.renderBar();
    var control = null;

    if (!this.state.limitReached) {
      control = (
        <TouchableOpacity onPressIn={this.toggleRecord.bind(this)} style={styles.controlBtn}>
          <Text>{this.state.recording ? 'Pause' : 'Record'}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <Recorder
        ref="recorder"
        flash={this.state.flash}
        config={this.state.config}
        device={this.state.device}
        onNewSegment={this.onNewSegment.bind(this)}
        style={styles.wrapper}>
        {bar}
        <View style={styles.infoBtn}>
          <Text style={styles.infoBtnText}>{this.state.nbSegments}</Text>
        </View>
        <View style={styles.controls}>
          {control}
          <TouchableOpacity onPressIn={this.reset.bind(this)} style={styles.controlBtn}>
            <Text>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.preview.bind(this)} style={styles.controlBtn}>
            <Text>Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleFlash.bind(this)} style={styles.controlBtn}>
            <Text>Flash</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.setDevice.bind(this)} style={styles.controlBtn}>
            <Text>Switch</Text>
          </TouchableOpacity>
        </View>
      </Recorder>
    );
  }
}



class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: false
    };
  }

  goBack() {
    this.setState({paused: true});
    this.props.navigator.pop();
  }

  render() {
    return (
      <TouchableWithoutFeedback style={styles.preview} onPress={() => this.goBack()}>
        <Video
          source={{uri: this.props.video}}
          style={styles.preview}
          rate={1.0}
          muted={false}
          volume={1.0}
          resizeMode="cover"
          paused={this.state.paused}
          repeat={true}/>
      </TouchableWithoutFeedback>
    );
  }
}


var App = React.createClass({
  render: function() {
    return (
      <NavigatorIOS initialRoute={{component: MyVideoRecord, title: 'Video Recorder'}} style={{flex: 1}} navigationBarHidden={true}/>
    );
  }
});


AppRegistry.registerComponent('record', () => App);
