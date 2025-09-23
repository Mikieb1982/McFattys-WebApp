McFatty's Food Tracker
A lightweight web app for mindful food tracking, now powered by Firebase. Create an account to save your food log and access it from any device.

Slow and steady wins the race. Not everything requires urgency.

Features
User Accounts: Sign up and log in to keep your food journal private and secure.

Cloud Storage: Your data is saved online, so you can access it from anywhere.

Minimalist Interface: A clean, single-page application that's fast and easy to use.

PWA Ready: Works offline and can be installed on your home screen for an app-like experience.

Accessibility Focused: Keyboard and screen reader friendly, with a red-green safe color palette.

Tech Stack
HTML5

Vanilla JavaScript

Firebase Authentication: For user sign-up and login.

Cloud Firestore: As a NoSQL database to store user data.

Getting Started
1. Set up Firebase
Go to the Firebase Console and create a new project.

Enable Authentication: Navigate to the "Authentication" section and enable the "Email/Password" sign-in method.

Set up Firestore Database: Go to the "Firestore Database" section and create a new database. Start in test mode for initial development (you can secure it later with security rules).

Get your Firebase Config: In your project settings, find and copy the Firebase SDK configuration object. It will look like this:

JavaScript

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
2. Configure the App
Clone the repository:

Bash

git clone https://github.com/Mikieb1982/McFattys.git
cd McFattys
Open index.html and paste your Firebase config object into the <script> section where indicated.

Serve the project locally using a static server. For example, with Python 3:

Bash

python -m http.server 8080
Open http://localhost:8080 in your browser. You should now be able to sign up and log in.

Data Model
Food entries are stored in a Cloud Firestore collection. Each user has their own document, and their food items are stored in a sub-collection.

users/{userId}/items/{itemId}
An item document has the following structure:

TypeScript

type Entry = {
  name: string,       // The name of the food item
  dairy: boolean,     // True if it contains dairy
  timestamp: number   // The server-side timestamp when it was added
}
