import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import Voice, {
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import Sound from 'react-native-sound';

// Backend configuration for voice chat bot
// const BACKEND_URL = 'http://10.0.2.2:8000'; // Android emulator
// const BACKEND_URL = 'http://localhost:8000'; // iOS simulator
const BACKEND_URL = 'http://192.168.2.220:8000'; // Physical device

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const initialize = async () => {
      // Initialize audio player
      Sound.setCategory('Playback');

      // Request microphone permissions
      if (Platform.OS === 'android') {
        try {
          const grants = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          ]);

          const audioGranted = grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED;
          
          if (!audioGranted) {
            Alert.alert('Microphone Permission Required', 'Please grant microphone access to use voice chat functionality.');
          }
        } catch (err) {
          console.warn('Permission request error:', err);
          Alert.alert('Permission Error', 'Failed to request microphone permissions.');
        }
      }

      // Setup voice recognition
      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechRecognized = onSpeechRecognized;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechError = onSpeechError;
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechPartialResults = onSpeechPartialResults;

      // Add initial AI greeting message and play it
      await startConversation();
    };
    
    initialize();
    
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSpeechStart = (e: any): void => {
    console.log('Voice recognition started', e);
    setIsListening(true);
    setTranscribedText('');
  };

  const onSpeechRecognized = (e: any): void => {
    console.log('Speech recognized', e);
  };

  const onSpeechEnd = (e: any): void => {
    console.log('Voice recognition ended', e);
    setIsListening(false);
  };

  const onSpeechError = (e: SpeechErrorEvent): void => {
    console.error('Voice recognition error:', e);
    setIsListening(false);
    if (e.error?.message) {
      Alert.alert('Voice Recognition Error', e.error.message);
    }
  };

  const onSpeechResults = (e: any): void => {
    console.log('Voice recognition results:', e);
    if (e.value && e.value.length > 0) {
      const recognizedText = e.value[0];
      setTranscribedText(recognizedText);
      processVoiceChat(recognizedText);
    }
  };

  const onSpeechPartialResults = (e: any): void => {
    if (e.value && e.value.length > 0) {
      setTranscribedText(e.value[0]);
    }
  };

  const startVoiceRecognition = async (): Promise<void> => {
    try {
      setTranscribedText('');
      setIsProcessing(false);
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      Alert.alert('Error', 'Failed to start voice recognition. Please try again.');
    }
  };

  const stopVoiceRecognition = async (): Promise<void> => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const playAudioResponse = async (audioUrl: string): Promise<void> => {
    try {
      const sound = new Sound(audioUrl, '', (error) => {
        if (error) {
          console.error('Failed to load the sound', error);
          Alert.alert('Audio Error', 'Failed to load audio response.');
          return;
        }
        
        // Play the sound
        sound.play((success) => {
          if (success) {
            console.log('Successfully finished playing audio');
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
          // Release the audio player resource
          sound.release();
        });
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Audio Error', 'Failed to play audio response.');
    }
  };

  const startConversation = async (): Promise<void> => {
    const greetingText = "Hello, how can I help you today?";
    
    // Add initial AI greeting to chat
    const greetingMessage: ChatMessage = {
      id: Date.now().toString(),
      text: greetingText,
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages([greetingMessage]);

    // Play the greeting audio
    try {
      // Create a URL with the greeting text for the TTS endpoint
      const audioUrl = `${BACKEND_URL}/text-to-speech-get?text=${encodeURIComponent(greetingText)}`;
      
      console.log('Playing greeting audio from URL:', audioUrl);
      
      // Play the greeting audio
      await playAudioResponse(audioUrl);
    } catch (error) {
      console.warn('Failed to play greeting audio:', error);
      // Continue without audio if TTS fails
    }
  };

  const processVoiceChat = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    setIsProcessing(true);
    setTranscribedText('');
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Send text to FastAPI backend for AI chat completion
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `text=${encodeURIComponent(text)}`,
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response;

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);

      // Convert AI response to speech and play it
      try {
        // Create a URL with the text as a query parameter for the GET endpoint
        const audioUrl = `${BACKEND_URL}/text-to-speech-get?text=${encodeURIComponent(aiResponse)}`;
        
        console.log('Playing audio from URL:', audioUrl);
        
        // Play the audio response
        await playAudioResponse(audioUrl);
      } catch (ttsError) {
        console.warn('Text-to-speech error:', ttsError);
        // Continue without audio playback if TTS fails
      }

      console.log('AI Response:', aiResponse);

    } catch (error) {
      console.error('Error processing voice chat:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error details:', errorMessage);
      Alert.alert('Error Details', `Failed to process voice chat: ${errorMessage}\n\nBackend URL: ${BACKEND_URL}/chat`);
      
      const chatErrorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${errorMessage}`,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, chatErrorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearChat = async (): Promise<void> => {
    setMessages([]);
    // Restart the conversation with a new greeting
    await startConversation();
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
  };

  const titleStyle = {
    color: isDarkMode ? '#fff' : '#000',
  };

  const welcomeTextStyle = {
    color: isDarkMode ? '#ccc' : '#666',
  };

  const welcomeSubtextStyle = {
    color: isDarkMode ? '#aaa' : '#888',
  };

  const processingContainerStyle = {
    backgroundColor: isDarkMode ? '#333' : '#e9ecef',
  };

  const processingTextStyle = {
    color: isDarkMode ? '#fff' : '#000',
  };

  const statusTextStyle = {
    color: isDarkMode ? '#aaa' : '#666',
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, titleStyle]}>
          Voice Chat Bot
        </Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {messages.length === 0 ? (
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeText, welcomeTextStyle]}>
              Voice Chat Bot is starting... 🎤
            </Text>
            <Text style={[styles.welcomeSubtext, welcomeSubtextStyle]}>
              Please wait while the AI prepares to greet you
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage,
              ]}>
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText,
              ]}>
                {message.text}
              </Text>
              <Text style={styles.timestamp}>
                {message.timestamp.toLocaleTimeString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Voice Recognition Status */}
      {transcribedText !== '' && (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionLabel}>Listening...</Text>
          <Text style={styles.transcriptionText}>{transcribedText}</Text>
        </View>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <View style={[styles.processingContainer, processingContainerStyle]}>
          <Text style={[styles.processingText, processingTextStyle]}>
            🤖 Thinking...
          </Text>
        </View>
      )}

      {/* Voice Control Button */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.micButton,
            isListening && styles.micButtonActive,
            isProcessing && styles.micButtonDisabled,
          ]}
          onPress={isListening ? stopVoiceRecognition : startVoiceRecognition}
          disabled={isProcessing}>
          <Text style={styles.micButtonText}>
            {isProcessing ? '⏳' : isListening ? '🛑' : '🎤'}
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.statusText, statusTextStyle]}>
          {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Tap to speak'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 15,
    borderRadius: 15,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    elevation: 1,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  transcriptionContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  transcriptionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  transcriptionText: {
    fontSize: 16,
    color: '#333',
  },
  processingContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  processingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  controlsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  micButtonActive: {
    backgroundColor: '#ff4444',
  },
  micButtonDisabled: {
    backgroundColor: '#ccc',
  },
  micButtonText: {
    fontSize: 30,
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;