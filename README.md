# NutriMobileApp
Progressive web mobile app focused on extracting the nutritional information from a photo.

First steps: (more detailed steps to follow in https://reactnative.dev/docs/environment-setup)
1. Node 
   - Windows: can be downloaded from https://chocolatey.org/
   - Linux: can be downloaded from https://nodejs.org/en/download/package-manager/
   - MacOs: can be downloaded from https://nodejs.org/en/download/package-manager/

2. Java 11
   - https://www.java.com/en/download/help/download_options.html
   - Make sure the user variable JAVA_HOME has no spaces
   - e.g. C:\Java\jdk-11

3. Android Studio (can be downloaded from https://developer.android.com/studio/index.html)
   - Make sure you download Android SDK, Android SDK Platform, Android Virtual Device
   - Once downloaded, select Android 12 (S) as SDK platforms from preferences tab (system settings>Android SDK)
   - Make sure Android 12 (S) platform includes Android SDK Platform 31 and Intel x86 Atom_64 System Image in its package details
   - Make sure Android 12 (S) platform includes Android SDK Build-Tools in its tools details
   - Add a user variable ANDROID_HOME as %LOCALAPPDATA%\Android\Sdk
   - Append a new path in user variable PATH as %PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools

4. Device manager 
   - Create device
   - Select Pixel 2
   - Select S as software (?) and download
   - Finish

5. Clone the project repository
   - git clone https...

6. Move to project directory
   - cd .\NutriApp\

7. Start device virtual emulator
   - Open device manager
   - Select virtual and choose one mobile device
   - Run |>

8. Run project:
   - npx react-native start
