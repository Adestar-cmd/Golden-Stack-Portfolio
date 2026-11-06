const firebaseConfig = {
  apiKey: "AIzaSyCQyMSahKZyNtR6OOEas_9oskDjDAcnzaM",
  authDomain: "goldenstack-portfolio.firebaseapp.com",
  projectId: "goldenstack-portfolio",
  storageBucket: "goldenstack-portfolio.firebasestorage.app",
  messagingSenderId: "153208085822",
  appId: "1:153208085822:web:17436be1115d3ffa69206f"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const webProjects = document.getElementById("web-projects");
const graphicProjects = document.getElementById("graphic-projects");

function createProjectCard(project) {
    const card = document.createElement("div");
    card.className = "project-card";

    const image = document.createElement("img");
    image.src = project.imageUrl;
    image.alt = project.name;
    image.loading = "lazy";

    const info = document.createElement("div");
    info.className = "project-info";

    const title = document.createElement("h4");
    title.textContent = project.name;

    const description = document.createElement("p");
    description.textContent = project.description;

    info.appendChild(title);
    info.appendChild(description);

    if (project.projectLink) {
        const link = document.createElement("a");
        link.href = project.projectLink;
        link.textContent = "View Project";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        info.appendChild(link);
    }

    card.appendChild(image);
    card.appendChild(info);

    return card;
}

function displayProjects() {
    db.collection("projects")
        .where("published", "==", true)
        .get()
        .then(function (snapshot) {

            webProjects.innerHTML = "";
            graphicProjects.innerHTML = "";

            let webCount = 0;
            let graphicCount = 0;

            snapshot.forEach(function (doc) {
                const project = doc.data();

                if (!project.imageUrl || !project.name || !project.description) {
                    return;
                }

                const card = createProjectCard(project);

                if (project.category === "Web Development") {
                    webProjects.appendChild(card);
                    webCount++;
                }

                if (project.category === "Graphic Design") {
                    graphicProjects.appendChild(card);
                    graphicCount++;
                }
            });

            if (webCount === 0) {
                webProjects.textContent = "No web development projects published yet.";
            }

            if (graphicCount === 0) {
                graphicProjects.textContent = "No graphic design projects published yet.";
            }

        })
        .catch(function (error) {
            console.error("Error loading projects:", error);

            webProjects.textContent = "Unable to load projects.";
            graphicProjects.textContent = "Unable to load projects.";
        });
}

displayProjects();
