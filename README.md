# NutriMobileApp
Progressive web mobile app focused on extracting the nutritional information from a photo.

First steps: (more detailed steps to follow in https://reactnative.dev/docs/environment-setup)
1. Node (can be downloaded from https://chocolatey.org/)

2. Java 11
   - Make sure the user variable JAVA_HOME has no spaces
   - e.g. C:\Java\jdk-11

3. Android Studio (can be downloaded from https://developer.android.com/studio/index.html)
   - Make sure you download Android SDK, Android SDK Platform, Android Virtual Device
   - Once downloaded, select Android 12 (S) as SDK platforms from preferences tab (system settings>Android SDK)
   - Make sure Android 12 (S) platform includes Android SDK Platform 31 and Intel x86 Atom_64 System Image in its package details
   - Make sure Android 12 (S) platform includes Android SDK Build-Tools in its tools details
   - Add a user variable ANDROID_HOME as %LOCALAPPDATA%\Android\Sdk
   - Append a new path in user variable PATH as %PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools

4. Clone the project repository
   - git clone https...

5. Move to project directory
   - cd .\NutriApp\

6. Start device virtual emulator
   - Open device manager
   - Select virtual and choose one mobile device
   - Run |>

7. Run project:
   - npx react-native start
