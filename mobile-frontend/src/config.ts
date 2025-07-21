// Configuration file for the Voice Chat Bot app

// Backend URL - Update this with your computer's IP address
// To find your IP address on Windows, run: ipconfig in command prompt
// Look for IPv4 Address under your network adapter
export const BACKEND_URL = 'http://192.168.1.100:8000';

// API endpoints
export const API_ENDPOINTS = {
  SPEECH_TO_TEXT: `${BACKEND_URL}/speech-to-text`,
  CHAT: `${BACKEND_URL}/chat`,
  TEXT_TO_SPEECH: `${BACKEND_URL}/text-to-speech`,
  VOICE_CHAT: `${BACKEND_URL}/voice-chat`,
};

// Voice recognition settings
export const VOICE_CONFIG = {
  LANGUAGE: 'en-US',
  TIMEOUT: 5000, // 5 seconds
};

// Audio settings
export const AUDIO_CONFIG = {
  SAMPLE_RATE: 44100,
  CHANNELS: 1,
  BITS_PER_SAMPLE: 16,
};
