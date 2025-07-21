# Android Development Setup Guide

## Current Status
✅ JDK 17 installed
✅ Android SDK found at: C:\Users\Hoang Anh\AppData\Local\Android\Sdk
✅ local.properties created
✅ Environment variables set (requires terminal restart)

## Next Steps to Complete Setup

### 1. Restart Your Terminal/PowerShell
Close and reopen your terminal to apply the new environment variables.

### 2. Create Android Virtual Device (AVD)

**Option A: Using Android Studio (Recommended)**
1. Open Android Studio
2. Go to Tools → AVD Manager
3. Click "Create Virtual Device"
4. Choose "Phone" → "Pixel 4" → Next
5. Select "API Level 36" (Android 14) → Next
6. Name it "VoiceChatBot_AVD" → Finish
7. Click the Play button to start the emulator

**Option B: If Android Studio AVD Manager doesn't work**
You can use a physical Android device:
1. Enable Developer Options on your Android phone
2. Enable USB Debugging
3. Connect via USB
4. Run `adb devices` to verify connection

### 3. Verify Setup
After creating an AVD and restarting terminal:

```bash
cd mobile-frontend
npx react-native doctor
```

All checks should now pass.

### 4. Run the Application

1. **Start the emulator** (if using AVD):
   - Open Android Studio → AVD Manager → Click Play button

2. **Start the backend server**:
   ```bash
   cd python-backend
   venv\Scripts\activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Start the React Native app**:
   ```bash
   cd mobile-frontend
   npx react-native run-android
   ```

### 5. Network Configuration

The app is configured to use `http://10.0.2.2:8000` which is the special IP address that Android emulator uses to access the host machine's localhost.

If using a physical device:
1. Find your computer's IP address: `ipconfig`
2. Update the BACKEND_URL in App.tsx to use your actual IP
3. Ensure both devices are on the same Wi-Fi network

## Troubleshooting

### If you still get "adb not found":
1. Restart your terminal completely
2. Check if adb is in PATH: `where adb`
3. If not found, manually add to PATH: `C:\Users\Hoang Anh\AppData\Local\Android\Sdk\platform-tools`

### If emulator doesn't start:
1. Check Windows virtualization is enabled
2. Try creating a different AVD with lower API level
3. Use a physical device instead

### If app can't connect to backend:
1. Make sure backend is running on all interfaces (0.0.0.0)
2. Check Windows Firewall isn't blocking port 8000
3. Verify IP address configuration

## Quick Commands

```bash
# Check environment
npx react-native doctor

# List available devices/emulators
adb devices

# Start Metro bundler only
npx react-native start

# Run on Android
npx react-native run-android

# Clean build (if issues)
cd android && ./gradlew clean && cd ..
```
