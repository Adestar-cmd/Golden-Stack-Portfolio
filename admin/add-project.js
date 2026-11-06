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
const db = firebase.firestore();

const adminUID = "Zdfc0t4l0tfWcFq8FA6GvZRhJ9y1";

const projectForm = document.getElementById("project-form");
const projectMessage = document.getElementById("project-message");
const saveButton = document.getElementById("save-project-btn");

let currentAdmin = null;

auth.onAuthStateChanged(function (user) {
    if (user && user.uid === adminUID) {
        currentAdmin = user;
    } else {
        auth.signOut().then(function () {
            window.location.href = "login.html";
        });
    }
});

projectForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!currentAdmin) {
        projectMessage.textContent = "Please sign in as an admin.";
        return;
    }

    if (!window.uploadedImageUrl) {
        projectMessage.textContent = "Please upload a project image first.";
        return;
    }

    const projectName = document.getElementById("project-name").value;
    const projectDescription = document.getElementById("project-description").value;
    const projectCategory = document.getElementById("project-category").value;
    const projectLink = document.getElementById("project-link").value;
    const featured = document.getElementById("featured-project").checked;
    const published = document.getElementById("published-project").checked;

    const projectData = {
        name: projectName,
        description: projectDescription,
        category: projectCategory,
        imageUrl: window.uploadedImageUrl,
        projectLink: projectLink,
        featured: featured,
        published: published,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    saveButton.disabled = true;
    saveButton.textContent = "Saving Project...";
    projectMessage.textContent = "";

    db.collection("projects").add(projectData)
        .then(function () {
            projectMessage.textContent = "Project saved successfully!";

            projectForm.reset();

            window.uploadedImageUrl = "";
            document.getElementById("image-preview").src = "";
            document.getElementById("image-preview").style.display = "none";
            document.getElementById("upload-message").textContent = "";

            saveButton.disabled = false;
            saveButton.textContent = "Save Project";
        })
        .catch(function (error) {
            projectMessage.textContent = error.message;

            saveButton.disabled = false;
            saveButton.textContent = "Save Project";
        });
});

document.getElementById("logout-btn").addEventListener("click", function () {
    auth.signOut().then(function () {
        window.location.href = "login.html";
    });
});
