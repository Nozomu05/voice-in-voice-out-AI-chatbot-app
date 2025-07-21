<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Voice Chat Bot Project Instructions

This is a mobile voice-in voice-out AI chatbot project with the following architecture:

## Project Structure
- `mobile-frontend/VoiceChatBot/` - React Native mobile app
- `python-backend/` - FastAPI backend server

## Key Technologies
- **Frontend**: React Native, TypeScript, Voice recognition, Audio playback
- **Backend**: FastAPI, OpenAI API, Speech Recognition, Text-to-Speech (gTTS)

## Important Context
1. The mobile app captures voice input, sends it to the backend for processing
2. Backend handles speech-to-text, AI chat completion, and text-to-speech conversion
3. The app plays back AI responses as audio for a complete voice chat experience

## Development Guidelines
- Use TypeScript for React Native components
- Follow React Native best practices for mobile development
- Implement proper error handling for voice recognition and network requests
- Consider Android and iOS platform differences
- Use proper async/await patterns for API calls
- Handle permissions properly for microphone access

## API Endpoints
- `POST /speech-to-text` - Convert audio to text
- `POST /chat` - Get AI response for text
- `POST /text-to-speech` - Convert text to audio
- `POST /voice-chat` - Complete voice chat flow

## Configuration
- Backend runs on port 8000
- Mobile app connects to backend via IP address
- OpenAI API key required for AI responses (set in .env file)
