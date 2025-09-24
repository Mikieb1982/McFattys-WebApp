// --- DOM Elements ---
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const logMealBtn = document.getElementById('log-meal-btn');

const menuOpenBtn = document.getElementById('menu-open-btn');
const menuCloseBtn = document.getElementById('menu-close-btn');
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');

const authActions = document.getElementById('auth-actions');
const landingPage = document.getElementById('landing-page');
const appContent = document.getElementById('app-content');
const welcomeMessage = document.getElementById('welcome-message');

const mealList = document.getElementById('meal-list');
const emptyStateMessage = document.getElementById('empty-state-message');

// --- Firebase Auth ---
const { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } = firebase.auth;
const auth = getAuth();
const provider = new GoogleAuthProvider();

// --- Authentication State Listener ---
onAuthStateChanged(auth, user => {
    if (user) {
        // User is signed in.
        authActions.style.display = 'none';
        menuOpenBtn.style.display = 'block';
        landingPage.style.display = 'none';
        appContent.style.display = 'block';
        welcomeMessage.textContent = `Hello, ${user.displayName || 'User'}`;
        updateMealListUI(); // Check for existing meals
    } else {
        // User is signed out.
        authActions.style.display = 'flex';
        menuOpenBtn.style.display = 'none';
        landingPage.style.display = 'block';
        appContent.style.display = 'none';
    }
});


// --- Event Listeners ---

// Google Sign-In
loginBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .catch((error) => {
            console.error("Authentication Error:", error.message);
        });
});

// Sign-Out
logoutBtn.addEventListener('click', () => {
    signOut(auth).catch((error) => {
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


// --- Dashboard Functionality ---

// Log a Meal Button
logMealBtn.addEventListener('click', () => {
    const mealDescription = prompt("What did you eat?");
    if (mealDescription && mealDescription.trim() !== '') {
        addMeal(mealDescription.trim());
    }
});

/**
 * Adds a new meal to our list and updates the UI.
 * @param {string} description The text description of the meal.
 */
function addMeal(description) {
    const newMeal = {
        id: Date.now(), // Simple unique ID
        description: description,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // For now, we'll store meals in localStorage.
    // In the future, we can move this to Firestore.
    const meals = getMealsFromStorage();
    meals.push(newMeal);
    saveMealsToStorage(meals);

    updateMealListUI();
}

/**
 * Renders the meals from storage to the screen.
 */
function updateMealListUI() {
    mealList.innerHTML = ''; // Clear the current list
    const meals = getMealsFromStorage();

    if (meals.length === 0) {
        emptyStateMessage.style.display = 'block';
    } else {
        emptyStateMessage.style.display = 'none';
        meals.forEach(meal => {
            const listItem = document.createElement('li');
            listItem.className = 'meal-item';
            listItem.innerHTML = `
                <span>${meal.description}</span>
                <span class="meal-time">${meal.time}</span>
            `;
            mealList.appendChild(listItem);
        });
    }
}

// --- Local Storage Helpers ---
// These functions help us store and retrieve data from the browser.

function getMealsFromStorage() {
    const meals = localStorage.getItem('meals');
    return meals ? JSON.parse(meals) : [];
}

function saveMealsToStorage(meals) {
    localStorage.setItem('meals', JSON.stringify(meals));
}
