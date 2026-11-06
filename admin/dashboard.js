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

const totalProjects = document.getElementById("total-projects");
const publishedProjects = document.getElementById("published-projects");
const featuredProjects = document.getElementById("featured-projects");
const projectsList = document.getElementById("projects-list");

auth.onAuthStateChanged(function (user) {
    if (user && user.uid === adminUID) {
        loadDashboard();
    } else {
        auth.signOut().then(function () {
            window.location.href = "login.html";
        });
    }
});

function loadDashboard() {
    db.collection("projects")
        .get()
        .then(function (snapshot) {
            totalProjects.textContent = snapshot.size;

            let publishedCount = 0;
            let featuredCount = 0;

            projectsList.innerHTML = "";

            if (snapshot.empty) {
                projectsList.innerHTML = "<p>No projects added yet.</p>";
                publishedProjects.textContent = 0;
                featuredProjects.textContent = 0;
                return;
            }

            const projects = [];

            snapshot.forEach(function (doc) {
                const project = doc.data();

                if (project.published === true) {
                    publishedCount++;
                }

                if (project.featured === true) {
                    featuredCount++;
                }

                projects.push(project);
            });

            publishedProjects.textContent = publishedCount;
            featuredProjects.textContent = featuredCount;

            projects.reverse();

            projects.slice(0, 5).forEach(function (project) {
                const projectItem = document.createElement("div");
                projectItem.className = "project-item";

                const name = document.createElement("h3");
                name.textContent = project.name || "Untitled Project";

                const category = document.createElement("p");
                category.textContent = project.category || "No category";

                const status = document.createElement("p");
                status.textContent = project.published ? "Published" : "Draft";

                projectItem.appendChild(name);
                projectItem.appendChild(category);
                projectItem.appendChild(status);

                projectsList.appendChild(projectItem);
            });
        })
        .catch(function (error) {
            console.error("Error loading dashboard:", error);
            projectsList.textContent = "Unable to load projects.";
        });
}

document.getElementById("logout-btn").addEventListener("click", function () {
    auth.signOut().then(function () {
        window.location.href = "login.html";
    });
});