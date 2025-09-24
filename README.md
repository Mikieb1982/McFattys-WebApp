# McFatty's Food Tracker

A lightweight, single-page web app for mindful food tracking, powered by Firebase. This app allows users to create an account, save their food log to the cloud, and access it from any device.

## Core Philosophy

Slow and steady wins the race. McFatty's is not about calorie counting, restrictions, or guilt. It's about the simple, mindful act of recording what you eat without judgment. This app will always be free, without subscriptions or upsells.

## Features

* **User Accounts**: Secure sign-up and login with email/password or Google Sign-in.
* **Cloud Storage**: Your data is saved to your private account and accessible from anywhere.
* **PWA Ready**: Works offline and can be installed on your home screen for an app-like experience.
* **Bilingual Support**: Toggle between English and German.
* **CSV Export**: Download your food log as a CSV file.
* **Customizable Theme**: A polished, retro-inspired design that's easy on the eyes.

## Tech Stack

* **HTML5**
* **CSS3**
* **Vanilla JavaScript**
* **Firebase Authentication**: For user sign-up and login.
* **Cloud Firestore**: A NoSQL database to store user data.

## Getting Started

To run this project, you'll need a Firebase account and a project with Authentication and Firestore enabled.

1.  **Set up Firebase**:
    * Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    * Enable **Email/Password** and **Google** as sign-in methods in the **Authentication** section.
    * Create a **Firestore Database** and set the security rules to allow authenticated users to read and write their own data.

2.  **Configure the App**:
    * Clone this repository.
    * Open `index.html` and replace the placeholder `firebaseConfig` object with your own Firebase project credentials.

3.  **Run Locally**:
    * Serve the `index.html` file with a local web server.

## Data Model

Food entries are stored in a Cloud Firestore collection with the following structure:

`users/{userId}/logs/{logId}`

An entry document contains the following fields:

* `name`: The name of the food item (string)
* `dairy`: A boolean indicating if the item contains dairy (boolean)
* `timestamp`: The server-side timestamp when the entry was added (timestamp)
