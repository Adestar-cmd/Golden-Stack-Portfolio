const firebaseConfig = {
  apiKey: "AIzaSyCQyMSahKZyNtR6OOEas_9oskDjDAcnzaM",
  authDomain: "goldenstack-portfolio.firebaseapp.com",
  projectId: "goldenstack-portfolio",
  storageBucket: "goldenstack-portfolio.firebasestorage.app",
  messagingSenderId: "153208085822",
  appId: "1:153208085822:web:17436be1115d3ffa69206f"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const loginButton = document.getElementById("login-btn");

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";
    loginMessage.textContent = "";

    auth.signInWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            if (userCredential.user.uid === "Zdfc0t4l0tfWcFq8FA6GvZRhJ9y1") {
                window.location.href = "index.html";
            } else {
                return auth.signOut().then(function () {
                    throw new Error("You are not authorised to access this dashboard.");
                });
            }
        })
        .catch(function (error) {
            loginMessage.textContent = error.message;
            loginButton.disabled = false;
            loginButton.textContent = "Sign In";
        });
});
