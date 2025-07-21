# Voice Chat Bot - Complete Mobile AI Assistant

A comprehensive voice-in, voice-out AI chatbot system consisting of a **Python FastAPI backend** and a **React Native mobile frontend**. This project enables natural voice conversations with AI through mobile devices.

## 🚀 Features

### Backend (Python FastAPI)
- 🎙️ Speech-to-text conversion using Google Speech Recognition
- 🤖 AI chat completion using OpenAI GPT API
- 🔊 Text-to-speech synthesis using Google TTS
- 🌐 RESTful API with automatic documentation
- 🔧 Modular audio processing with FFmpeg
- ⚡ Fast, async web framework

### Frontend (React Native)
- 📱 Cross-platform mobile application (iOS & Android)
- 🎤 Real-time voice recognition
- 💬 Beautiful chat interface with message history
- 🌓 Dark/Light theme support
- 🔐 Automatic permission handling
- 🎨 Modern Material Design UI

## 📋 Prerequisites

### Backend Requirements
- Python 3.8+
- FFmpeg (for audio processing)
- OpenAI API key

### Frontend Requirements
- Node.js 14+
- React Native development environment
- Android Studio (Android) or Xcode (iOS)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mobile-app
```

### 2. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd python-backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   # Create .env file
   echo OPENAI_API_KEY=your_openai_api_key_here > .env
   ```

5. **Install FFmpeg:**
   ```bash
   # Windows (using winget)
   winget install --id=Gyan.FFmpeg  -e
   
   # macOS (using Homebrew)
   brew install ffmpeg
   
   # Linux (Ubuntu/Debian)
   sudo apt update && sudo apt install ffmpeg
   ```

### 3. Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd mobile-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **iOS additional setup (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Configure backend URL:**
   - Open `mobile-frontend/App.tsx`
   - Update `BACKEND_URL` with your computer's IP address
   - Find IP: `ipconfig` (Windows) or `ifconfig` (macOS/Linux)

## 🚀 Running the Application

### Option 1: Using VS Code Tasks (Recommended)

1. **Open VS Code in the project root**
2. **Press `Ctrl+Shift+P` and type "Tasks: Run Task"**
3. **Select "Run FastAPI Backend"** to start the server
4. **Select "Run React Native Android"** to start the mobile app

### Option 2: Manual Command Line

1. **Start the backend server:**
   ```bash
   cd python-backend
   venv\Scripts\activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the React Native app:**
   ```bash
   cd mobile-frontend
   
   # For Android
   npx react-native run-android
   
   # For iOS (macOS only)
   npx react-native run-ios
   ```

## 📱 Usage

1. **Start the backend server** first
2. **Launch the mobile app** on your device/emulator
3. **Tap the microphone button** to start voice recording
4. **Speak your message** and tap stop
5. **Wait for AI response** (both text and audio)
6. **Continue the conversation** naturally

## 🏗️ Project Structure

```
mobile app/
├── python-backend/          # FastAPI backend server
│   ├── main.py             # Main application file
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables
│   └── venv/              # Virtual environment
├── mobile-frontend/        # React Native mobile app
│   ├── App.tsx            # Main app component
│   ├── android/           # Android-specific files
│   ├── ios/               # iOS-specific files
│   ├── src/               # Source code
│   └── package.json       # Node.js dependencies
├── .vscode/
│   └── tasks.json         # VS Code tasks configuration
└── README.md              # This file
```

## 🔧 API Endpoints

The backend provides the following REST API endpoints:

- `GET /` - API status and documentation
- `POST /speech-to-text` - Convert audio to text
- `POST /chat` - Send message, get AI response
- `POST /text-to-speech` - Convert text to audio
- `POST /voice-chat` - Complete voice conversation (audio in, audio out)

## 🛠️ Configuration

### Backend Configuration (`.env`)
```env
OPENAI_API_KEY=your_openai_api_key_here
HOST=0.0.0.0
PORT=8000
```

### Frontend Configuration (`App.tsx`)
```typescript
const BACKEND_URL = 'http://YOUR_COMPUTER_IP:8000';
```

## 🔍 Troubleshooting

### Common Issues

1. **Backend won't start:**
   - Check Python version (3.8+)
   - Ensure virtual environment is activated
   - Verify all dependencies are installed

2. **Mobile app can't connect:**
   - Verify backend server is running
   - Check IP address in BACKEND_URL
   - Ensure devices are on same network

3. **Voice recognition not working:**
   - Check microphone permissions
   - Ensure internet connection
   - Try restarting the app

4. **FFmpeg errors:**
   - Restart terminal after installation
   - Verify FFmpeg is in system PATH
   - Check audio file formats

### Development Tips

- **Backend logs:** Check terminal for detailed error messages
- **Frontend logs:** Use React Native debugger or device logs
- **Network issues:** Use `ipconfig`/`ifconfig` to verify IP addresses
- **Permissions:** Grant microphone access when prompted

## 🧪 Testing

### Backend Testing
```bash
cd python-backend
# Test with curl or Postman
curl -X POST "http://localhost:8000/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello, AI!"}'
```

### Frontend Testing
- Use React Native debugger
- Test on physical device for best voice recognition
- Check network connectivity between devices

## 🚧 Future Enhancements

- [ ] Audio playback in mobile app
- [ ] Conversation history persistence
- [ ] Multiple AI model support
- [ ] Voice settings customization
- [ ] Offline mode capabilities
- [ ] Multi-language support
- [ ] Conversation export features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for GPT API
- Google for Speech Recognition and TTS services
- React Native community for mobile framework
- FastAPI for the excellent web framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the individual README files in each directory
3. Open an issue on the repository
4. Check the API documentation at `http://localhost:8000/docs` when backend is running

---

**Happy coding! 🎉**
