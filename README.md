The Food Mutiny
A lightweight, single-page web app for mindful food tracking, powered by Firebase. This app allows users to create an account, save their food log to the cloud, and access it from any device.

Core Philosophy
Slow and steady wins the race. The Food Mutiny is not about calorie counting, restrictions, or guilt. It's about the simple, mindful act of recording what you eat without judgment. This app will always be free, without subscriptions or upsells.

Features
Mindful Food Logging: Quickly log what you've eaten and add context like whether it contained dairy or was eaten outside of a mealtime.

User Accounts: Secure sign-up and login with email/password or Google Sign-in.

Cloud Storage: Your data is saved to your private account and accessible from anywhere.

PWA Ready: Works offline and can be installed on your home screen for an app-like experience.

Bilingual Support: Toggle between English and German.

CSV Export: Download your food log as a CSV file.

Customizable Dashboard: Drag and drop tiles to arrange the dashboard to your liking.

Light & Dark Modes: A polished, retro-inspired design that's easy on the eyes, with both light and dark themes.

Tech Stack
HTML5

CSS3

Vanilla JavaScript

Firebase Authentication: For user sign-up and login.

Cloud Firestore: A NoSQL database to store user data.

Getting Started
To run this project locally, you'll need a Firebase account.

1. Set up Firebase
Create a new project in the Firebase Console.

Enable Email/Password and Google as sign-in methods in the Authentication section.

Create a Firestore Database and use the following security rules to allow authenticated users to read and write their own data:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
2. Configure the App
Clone this repository.

Open js/main.js and replace the placeholder firebaseConfig object with your own Firebase project credentials. You can find these in your Firebase project settings.

3. Run Locally
You can use a simple local web server to run the app. If you have Python installed, you can run the following command in the project directory:
python -m http.server

If you have Node.js installed, you can use the live-server package:
npx live-server

Deploying to Firebase Hosting
Install the Firebase CLI if you have not already done so.

Authenticate with Firebase:

Bash

firebase login
Update the .firebaserc file with the ID of the Firebase project you created earlier.

Preview the site locally to make sure everything looks correct:

Bash

firebase emulators:start --only hosting
The site will be served at the URL shown in the terminal output.

When you are ready to deploy, run:

Bash

firebase deploy --only hosting
Data Model
Food entries and user data are stored in a Cloud Firestore collection with the following structure:

users/{userId} - A document for each user.

logs/{logId} - A subcollection of food log entries.

name: The name of the food item (string)

dairy: A boolean indicating if the item contains dairy (boolean)

outsideMeals: A boolean indicating if the item was eaten outside of a mealtime (boolean)

timestamp: The server-side timestamp when the entry was added (timestamp)

context/{contextId} - An optional subcollection for contextual information about the entry.

feeling: The user's feeling after eating (e.g., "energized", "satisfied", "sluggish") (string)

setting: Where the user was when they ate (string)

timestamp: The server-side timestamp when the context was added (timestamp)

intentions/{date} - A subcollection of daily intentions, where the document ID is the date in YYYY-MM-DD format.

text: The user's intention for the day (string)

date: The date of the intention (string)

timestamp: The server-side timestamp when the intention was saved (timestamp)
