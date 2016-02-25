# react-native-screcorder DEMO APP for React Native 0.20.0

I had a hard time getting the react-native-screcorder demo app to work, as well as setting it up on a fresh demo app of my own. So once I got it working, I decided to make this for you!

Some of the issues I came across that were solved are:

- correct `config` was set, including things like video bitrate (which is required), audio settings which was left out of the demo app
- brought everything up to speed with ES6 (classes, imports, function binding to `this`, this.state set in `constructor`, etc)
- directions below for setting up *react-native-video* which was not described for the original demo app. I had one of those naive moments where for a few hours I just expected the video playback native tools to just work, but it turns out I had to manually add some things to Xcode for that too.
- As minor as it turned out, the *Record* button required you to hold it down, and I wasn't aware of that. My demo here has it changed so you can just tap it, and then the text on the button will change to *Pause* which I think is a more obvious user experience, especially if you're just trying to get these damn tools to work!
- Lastly, it might not be clear, but you can record multiple segments, and then when you preview them, they will all play back to back. The blue bar at the top only lets you record to the limit you have set (which is 20 seconds in this demo; previously it was 3 seconds and I had no idea what was going on at first when nothing yet was working).

## DIRECTIONS

###A. git clone this, cd into the directory and run `npm install`

###B. Follow the react-native-screcorder "Getting started" directions:
https://github.com/maxs15/react-native-screcorder

1. `npm install react-native-screcorder@latest --save`
2. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
3. Go to `node_modules` ➜ `react-native-recorder` and add `RNRecorder.xcodeproj`
4. In XCode, in the project navigator, select your project. Go to the `Build Phases` Tab and expand the `Link Binary With Libraries` section and then Add `libRNRecorder.a`
5. Click `RNRecorder.xcodeproj` in the project navigator and go the `Build Settings` tab. Make sure 'All' is toggled on (instead of 'Basic'). Look for `Header Search Paths` and make sure it contains both `$(SRCROOT)/../react-native/React` and `$(SRCROOT)/../../React` - mark both as `recursive`. There may be something similar already--just add these in addition.
6. Whenever you want to use it within React code now you can: `import Video from 'react-native-screcorder';`


###C. Follow the react-native-video "Getting started" directions (they are outdated in the github repo):
https://github.com/brentvatne/react-native-video

1. Open your project in XCode, right click on Libraries and click Add Files to "Your Project Name"
2. This one had incorrect info--here's the correct info: Within the `node_modules` of your React Native project, find the `react-native-video` folder, and then select RCTVideo.xcodeproj
3. In XCode, in the project navigator, select your project. Go to the `Build Phases` Tab and expand the `Link Binary With Libraries` section and then Add `libRCTVideo.a`
4. The instructions say: "Add .mp4 video file to project and to Build Phases -> Copy Bundle Resources" but you don't need this with eact-native-screcorder because it will generate that .mp4 for you :)
5. Whenever you want to use it within React code now you can: `import Video from 'react-native-video';`


###D. Run your project (`Cmd+R`) in Xcode. You will need to build for your device, not the simulator

1. run ifconfig from the command line to get your computer's IP address on your local router. It will be in the `en0` section and is generally something like `192.168.0.2`
2. replace `localhost` with this address in `AppDelegate.m` within your project within Xcode.
3. If you want remote debugging you will have to do the same in `MyProject/Libraries/RCTWebSocket.xcodeproj/RCTWebSocketExecutor.m`. Search the page for `localhost` and replace it with your ip address.
5. you may have to change the Bundle Identifier name within Xcode. Click the main project file at the top, and in the *General* section, you will see the "Bundle Identifier" field. Add some words of your own there. If you have yet to run apps on your device yet, you will have to google elsewhere to figure out how. 
4. Plug your phone in, select it in the top left of Xcode and run your project: `Cmd+R`
