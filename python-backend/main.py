from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import speech_recognition as sr
from gtts import gTTS
from openai import OpenAI
import os
from dotenv import load_dotenv
import warnings

# Suppress pydub ffmpeg warnings specifically
warnings.filterwarnings("ignore", "Couldn't find ffmpeg or avconv", RuntimeWarning)

from pydub import AudioSegment

# Note: ffmpeg warning has been suppressed. 
# For production use, install ffmpeg: https://ffmpeg.org/download.html

# Load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
)

# Background task function for file cleanup
def cleanup_file(file_path: str):
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Cleaned up file: {file_path}")
    except Exception as e:
        print(f"Error cleaning up file {file_path}: {e}")

@app.post("/speech-to-text")
async def speech_to_text(audio: UploadFile = File(...)):
    recognizer = sr.Recognizer()
    audio_path = f"temp_{audio.filename}"
    
    try:
        # Save uploaded file
        with open(audio_path, "wb") as f:
            content = await audio.read()
            f.write(content)
        
        # Convert to WAV format
        sound = AudioSegment.from_file(audio_path)
        wav_path = audio_path + ".wav"
        sound.export(wav_path, format="wav")
        
        # Recognize speech
        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)
            try:
                text = recognizer.recognize_google(audio_data)
            except sr.UnknownValueError:
                text = "Could not understand audio"
            except sr.RequestError as e:
                text = f"Error with speech recognition service: {e}"
        
        # Clean up files
        if os.path.exists(audio_path):
            os.remove(audio_path)
        if os.path.exists(wav_path):
            os.remove(wav_path)
            
        return {"text": text}
    
    except Exception as e:
        # Clean up files in case of error
        if os.path.exists(audio_path):
            os.remove(audio_path)
        if os.path.exists(wav_path):
            os.remove(wav_path)
        return {"text": f"Error processing audio: {str(e)}"}

@app.post("/chat")
def chat(text: str = Form(...)):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": text}]
        )
        ai_text = response.choices[0].message.content
    except Exception as e:
        ai_text = "Sorry, I couldn't process your request."
    return {"response": ai_text}

@app.post("/text-to-speech")
async def text_to_speech(background_tasks: BackgroundTasks, text: str = Form(...)):
    try:
        tts = gTTS(text=text, lang='en')
        audio_path = f"response_{hash(text)}.mp3"
        tts.save(audio_path)
        
        # Add cleanup task to background
        background_tasks.add_task(cleanup_file, audio_path)
        
        return FileResponse(
            audio_path, 
            media_type="audio/mpeg", 
            filename="response.mp3"
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error generating speech: {str(e)}"}
        )

@app.get("/text-to-speech-get")
async def text_to_speech_get(background_tasks: BackgroundTasks, text: str):
    try:
        tts = gTTS(text=text, lang='en')
        audio_path = f"response_{hash(text)}.mp3"
        tts.save(audio_path)
        
        # Add cleanup task to background
        background_tasks.add_task(cleanup_file, audio_path)
        
        return FileResponse(
            audio_path, 
            media_type="audio/mpeg", 
            filename="response.mp3"
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error generating speech: {str(e)}"}
        )

@app.post("/voice-chat")
async def voice_chat(background_tasks: BackgroundTasks, audio: UploadFile = File(...)):
    recognizer = sr.Recognizer()
    audio_path = f"temp_{audio.filename}"
    wav_path = ""
    
    try:
        # Speech to text
        with open(audio_path, "wb") as f:
            content = await audio.read()
            f.write(content)
        
        sound = AudioSegment.from_file(audio_path)
        wav_path = audio_path + ".wav"
        sound.export(wav_path, format="wav")
        
        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)
            try:
                text = recognizer.recognize_google(audio_data)
            except sr.UnknownValueError:
                text = "Could not understand audio"
            except sr.RequestError as e:
                text = f"Error with speech recognition service: {e}"
        
        # Clean up input files
        if os.path.exists(audio_path):
            os.remove(audio_path)
        if os.path.exists(wav_path):
            os.remove(wav_path)
        
        # Chat
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": text}]
            )
            ai_text = response.choices[0].message.content
        except Exception as e:
            ai_text = f"Sorry, I couldn't process your request: {str(e)}"
        
        # Text to speech
        tts = gTTS(text=ai_text, lang='en')
        response_audio_path = f"response_{hash(ai_text)}.mp3"
        tts.save(response_audio_path)
        
        # Add cleanup task to background
        background_tasks.add_task(cleanup_file, response_audio_path)
        
        return FileResponse(
            response_audio_path, 
            media_type="audio/mpeg", 
            filename="response.mp3"
        )
    
    except Exception as e:
        # Clean up files in case of error
        if os.path.exists(audio_path):
            os.remove(audio_path)
        if os.path.exists(wav_path):
            os.remove(wav_path)
        return JSONResponse(
            status_code=500,
            content={"error": f"Error processing voice chat: {str(e)}"}
        )

@app.get("/")
def root():
    return {"message": "Voice Chat Bot API is running."}

if __name__ == "__main__":
    import uvicorn
    print("Starting Voice Chat Bot API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
