// --- DOM Elements ---
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');

const menuOpenBtn = document.getElementById('menu-open-btn');
const menuCloseBtn = document.getElementById('menu-close-btn');
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');

const authActions = document.getElementById('auth-actions');
const landingPage = document.getElementById('landing-page');
const appContent = document.getElementById('app-content');
const welcomeMessage = document.getElementById('welcome-message');

// --- Firebase Auth ---
// (Assuming 'auth' is initialized in app.js)
const { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } = firebase.auth;
const auth = getAuth();
const provider = new GoogleAuthProvider();

// --- Authentication State Listener ---
// This is the core of the solution. It runs whenever a user signs in or out.
onAuthStateChanged(auth, user => {
    if (user) {
        // User is signed in.
        console.log('User is logged in:', user);
        authActions.style.display = 'none';      // Hide Login/Signup buttons
        menuOpenBtn.style.display = 'block';     // Show the hamburger menu icon
        landingPage.style.display = 'none';      // Hide the landing page content
        appContent.style.display = 'block';      // Show the main app content
        welcomeMessage.textContent = `Welcome, ${user.displayName || 'User'}`; // Display a welcome message
    } else {
        // User is signed out.
        console.log('User is logged out.');
        authActions.style.display = 'flex';      // Show Login/Signup buttons
        menuOpenBtn.style.display = 'none';      // Hide the hamburger menu icon
        landingPage.style.display = 'block';     // Show the landing page content
        appContent.style.display = 'none';       // Hide the main app content
    }
});


// --- Event Listeners ---

// Google Sign-In
loginBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log('Signed in user:', user);
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.error("Authentication Error:", errorMessage);
        });
});

// Sign-Out
logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        // The onAuthStateChanged observer will handle the UI changes automatically.
        // We just need to close the sidebar if it's open.
        sidebar.classList.remove('open');
        scrim.classList.remove('show');
    }).catch((error) => {
        // An error happened.
        console.error('Sign-out Error:', error);
    });
});

// Sidebar Toggle
menuOpenBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    scrim.classList.add('show');
});

menuCloseBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    scrim.classList.remove('show');
});

scrim.addEventListener('click', () => {
    sidebar.classList.remove('open');
    scrim.classList.remove('show');
});
