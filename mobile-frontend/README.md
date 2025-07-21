This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Voice Chat Bot - Mobile Frontend

A React Native mobile application that provides voice-in, voice-out AI chat functionality. This app connects to the Python FastAPI backend to process voice inputs and generate AI responses.

## Features

- 🎤 Voice recognition for speech input
- 🤖 AI-powered conversation using OpenAI API
- 🔊 Text-to-speech for AI responses (backend)
- 📱 Beautiful mobile UI with dark/light theme support
- 💬 Chat history with timestamps
- 🎨 Modern Material Design interface

## Prerequisites

- Node.js (v14 or higher)
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Running Python backend server

## Installation

1. **Install dependencies:**
   ```bash
   cd mobile-frontend
   npm install
   ```

2. **Install iOS dependencies (iOS only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Configure backend URL:**
   - Open `App.tsx`
   - Update the `BACKEND_URL` constant with your computer's IP address
   - Find your IP address:
     - Windows: `ipconfig` in Command Prompt
     - macOS/Linux: `ifconfig` in Terminal
   - Example: `const BACKEND_URL = 'http://192.168.1.100:8000';`

## Running the App

### Android

1. **Connect an Android device or start an emulator**

2. **Run the application:**
   ```bash
   npx react-native run-android
   ```

### iOS (macOS only)

1. **Open iOS Simulator or connect an iOS device**

2. **Run the application:**
   ```bash
   npx react-native run-ios
   ```

## Configuration

### Backend Connection

The app connects to the Python FastAPI backend running on your computer. Make sure to:

1. Start the Python backend server first
2. Update the IP address in `App.tsx` to match your computer's network IP
3. Ensure both devices are on the same network

### Permissions

The app requires the following permissions:
- **Microphone access** - For voice recognition
- **Network access** - For API communication
- **Storage access** - For temporary audio files

These permissions are automatically requested when the app starts.

## Architecture

```
App.tsx
├── Voice Recognition (@react-native-voice/voice)
├── API Communication (fetch)
├── Message Management (React state)
└── UI Components (React Native)
```

## API Endpoints Used

- `POST /chat` - Send text message and get AI response
- `POST /text-to-speech` - Convert AI response to audio (future feature)

## Dependencies

- **@react-native-voice/voice** - Voice recognition
- **react-native-audio-recorder-player** - Audio playback (planned)
- **react-native-permissions** - Permission management

## Troubleshooting

### Common Issues

1. **"Network request failed"**
   - Check that the backend server is running
   - Verify the IP address in BACKEND_URL
   - Ensure both devices are on the same network

2. **Voice recognition not working**
   - Check microphone permissions
   - Ensure device has internet connection
   - Try restarting the app

3. **Build errors**
   - Run `npm install` to ensure all dependencies are installed
   - For iOS: `cd ios && pod install`
   - Clean build: `npx react-native clean`

### Development

- **Metro bundler issues**: `npx react-native start --reset-cache`
- **Android build issues**: Clean project in Android Studio
- **iOS build issues**: Clean build folder in Xcode

## Features in Development

- Audio playback for AI responses
- Conversation export
- Voice settings and customization
- Offline mode support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of a larger voice chat bot system. See the main project README for license information.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
