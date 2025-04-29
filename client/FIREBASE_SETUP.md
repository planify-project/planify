# Firebase Authentication Setup Guide

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click on "Add project"
3. Enter a project name and follow the setup steps
4. Once your project is created, you'll be taken to the project dashboard

## Step 2: Register Your App with Firebase

1. In the Firebase console, click on the web icon (`</>`) to add a web app
2. Enter your app's nickname (e.g., "Planify Web")
3. (Optional) Check the box for "Also set up Firebase Hosting"
4. Click "Register app"
5. Firebase will provide you with a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

## Step 3: Update Your App.js Configuration

1. Replace the placeholder Firebase configuration in `App.js` with your actual configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

## Step 4: Enable Email/Password Authentication

1. In the Firebase console, go to "Authentication" in the left sidebar
2. Click the "Sign-in method" tab
3. Click on "Email/Password" 
4. Enable the "Email/Password" sign-in method
5. Click "Save"

## Step 5: Testing Your Authentication

1. Run your app with `npm start` or `expo start`
2. Try to sign up with a new email and password
3. Try to sign in with the created credentials
4. Test the logout functionality

## Common Issues and Solutions

1. **Firebase import errors**: Make sure you're importing from 'firebase/app' and 'firebase/auth' (not '@firebase/app')
2. **Authentication errors**: Check the Firebase console for error messages
3. **Configuration issues**: Verify your firebaseConfig object matches exactly what Firebase provided
4. **Firebase rules**: If you plan to use Firestore or Realtime Database, be sure to set up security rules

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Expo Firebase Documentation](https://docs.expo.dev/guides/using-firebase/) 