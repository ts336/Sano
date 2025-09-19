# **Sano: Healthcare Made Easy**

Sano is a mobile application built with React Native and Expo that simplifies the process of booking healthcare appointments. The app allows users to log in, choose a practitioner and appointment type and select a date and time, providing an intuitive booking experience. The app is not performance-intensive. 

## **Key Features**

- Access the app's features using a predetermined username and password.
- A user-friendly interface for selecting all appointment details.
- A final screen to review and confirm all booking information before saving.
- Appointment details are saved locally on the device (the actual file cannot be accessed by the user by default since it will be saved within the Expo Go app).

## **Getting Started**

### **Prerequisites**

To run this application, you need to have the following installed:

- **Node.js**: The prebuilt version is fine. Go to the official node.js website and download the prebuilt version.
- **npm**: A package manager for installing dependencies. Prefer npm since it comes with [Node.js](http://node.js) prebuilt version.
- **Git**: For cloning the Sano repository.
- **Expo Go**: The mobile app for iOS or Android that allows you to run React Native projects on your physical device.

### **Installation & Setup**

This is a complete walkthrough on how to use this program. First, ensure the above requirements are met. **Do not move directories until specified.**

1. **Go to Terminal/command prompt. Ensure that you are in the right drive. On Windows, you may be on the H: drive. Please move to the C: drive (or whichever drive you will be downloading the Sano files to). This can be done by entering `cd /d c:\` into the terminal. **
2. **Check that `npx` and `npm` are up to date. You can use commands like `npm -v` to check the version.**
3. **Check that `git` is up to date.** (not needed if downloading from github)
4. **In your terminal, navigate to the directory where you want to have the Sano folder (or just use your desktop - no action required).**

_To move directories: `cd nameOfDirectory(file name)`_
_To make a new directory: `mkdir nameOfDirectory(file name)`_
   

**Clone the Repository**

Staying in the current terminal tab, run the following command to download the project:  
`git clone <https://github.com/ts336/Sano>`

If you do not want to download git, you can get the Sano files from GitHub. On the Sano GitHub homepage, press code, then download as ZIP.

**Navigate to the Project Directory**

Change into the project folder:  
`cd Sano` (terminal)
For Windows, type `cd` and copy the file path to the Sano file (which has all the Sanoo app files in it) and paste it after `cd`.

**Install Dependencies**

Install all the necessary packages for the app:  
`npm install`

If Expo says any packages need updates, enter: `npm update nameofpackage`

**Run the Application**

Start the Expo development server:  
`npx expo start`

If this does not work, try adding `--tunnel` to the end of the command. You may be asked to download ngrok. Please press Y to install. If it doesn't work, press ctrl + c to stop the hosting, then enter `npm install ngrok`. Try use `--tunnel` again.

1. After running this command, a QR code will appear in your terminal.
2. **View the App**
    - **On your phone:** Open the **Camera** app and scan the QR code on your terminal. The Expo Go app should load automatically. If Expo Go is not installed on your phone, you will be directed to the app store. Make sure that your phone and the hosting device (laptop) are on the same wifi network.
    - **On a web browser:** Alternatively, you may open the web version by entering `w` in the terminal. However, this is not the intended use, and the display may be awkward.
    - **On an emulator:** Press `a` for Android or `i` for iOS to launch the app on an emulator if you have one set up.

## **Important Notes ⚠️**

- **Login Credentials:** For this version of the app, the login is hardcoded. Use the following credentials:
  - **Username:** test
  - **Password:** 123
- **Dark Mode:** The app's design is optimised for light mode. Please ensure **dark mode is turned off** on the device running the app for the best viewing experience.
- **File Size:** The project may take up to 300-400MB of space on your device. Please ensure you have sufficient storage.

## **Troubleshooting & FAQ ❓**

- **npm install fails:** This could be due to network issues or an outdated Node.js version. Try running the command again, or check your Node.js installation.
- **App not loading on phone:** Ensure your computer and your phone are connected to the **same Wi-Fi network**.
- **Can't find the QR code:** Scroll up in your terminal to see the output from the npx expo start command.
- **Same network but still not working:** Please use the command `npx expo start --tunnel`, or try from your home wifi (organisation and public wifi may have restrictions on them, preventing the app from working).
