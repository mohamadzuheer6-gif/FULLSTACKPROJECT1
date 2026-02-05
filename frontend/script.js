// API URL is loaded from config.js
const API = window.API;
const ADMIN_KEY = "zuheer123";

function getAuthHeaders() {
    const key = sessionStorage.getItem("auth");
    if (!key) return {};
    return {
        "X-API-Key": key
    };
}

/* ---------- DOM REFERENCES ---------- */
const profileView = document.getElementById("profileView");
const skills = document.getElementById("skills");
const projects = document.getElementById("projects");

const pName = document.getElementById("pName");
const pEmail = document.getElementById("pEmail");
const pEdu = document.getElementById("pEdu");

const skillName = document.getElementById("skillName");
const skillProf = document.getElementById("skillProf");

const projTitle = document.getElementById("projTitle");
const projDesc = document.getElementById("projDesc");
const projLink = document.getElementById("projLink");

function login() {
    const key = prompt("Enter admin key:");
    if (key === ADMIN_KEY) {
        sessionStorage.setItem("auth", key);
        alert("Logged in as Admin");
        updateUI();
    } else {
        alert("Invalid key");
    }
}

function logout() {
    sessionStorage.removeItem("auth");
    alert("Logged out");
    updateUI();
}

function updateUI() {
    const loggedIn = sessionStorage.getItem("auth");

    document.querySelectorAll(".edit-box").forEach(box => {
        box.style.display = loggedIn ? "block" : "none";
    });
    
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.style.display = loggedIn ? "inline-block" : "none";
    }
    const badge = document.getElementById("adminBadge");
    if (badge) {
        badge.style.display = loggedIn ? "inline-block" : "none";
    }
}

/* ---------- TOGGLE SECTION ---------- */
function toggleSection(id) {
    const el = document.getElementById(id);
    if (el.style.display === "none" || el.style.display === "") {
        el.style.display = "block";
        return true;
    } else {
        el.style.display = "none";
        return false;
    }
}

/* ---------- PROFILE ---------- */
function toggleProfile() {
    loadProfile();
}

function loadProfile() {
    if (!toggleSection("profileView")) return;

    fetch(`${API}/profile`)
        .then(r => r.json())
        .then(p => {
            profileView.innerHTML = `
                <p><b>Name:</b> ${p.name}</p>
                <p><b>Email:</b> ${p.email}</p>
                <p><b>Education:</b> ${p.education}</p>
            `;
            pName.value = p.name || "";
            pEmail.value = p.email || "";
            pEdu.value = p.education || "";
        })
        .catch(err => {
            console.error("Error loading profile:", err);
            alert("Error loading profile: " + err.message);
        });
}

function saveProfile() {
    fetch(`${API}/profile`, {
        method: "PATCH",
        headers: {"Content-Type":"application/json", ...getAuthHeaders()},
        body: JSON.stringify({
            name: pName.value,
            email: pEmail.value,
            education: pEdu.value
        })
    })
    .then(() => loadProfile())
    .catch(err => {
        console.error("Error saving profile:", err);
        alert("Error saving profile: " + err.message);
    });
}

/* ---------- SKILLS ---------- */
function toggleloadSkills() {
    loadSkills();
}

function loadSkills() {
    // Ensure section is visible
    const skillsSection = document.getElementById("skills");
    skillsSection.style.display = "block";

    fetch(`${API}/skills`)
        .then(r => r.json())
        .then(data => {
            skills.innerHTML = "";
            data.forEach(s => {
                skills.innerHTML += `
                    <li>
                        <strong>${s.name}</strong>
                        <span class="badge ${s.proficiency.toLowerCase()}">
                            ${s.proficiency}
                        </span>
                        <button onclick="deleteSkill(${s.id})">❌</button>
                    </li>
                `;
            });
        })
        .catch(err => {
            console.error("Error loading skills:", err);
            alert("Error loading skills: " + err.message);
        });
}

function addSkill() {
    if (!skillName.value || !skillProf.value) {
        alert("Please enter skill name and proficiency");
        return;
    }

    fetch(`${API}/skills`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({
            name: skillName.value,
            proficiency: skillProf.value
        })
    })
    .then(() => {
        skillName.value = "";
        skillProf.value = "";
        loadSkills();
    })
    .catch(err => {
        console.error("Error adding skill:", err);
        alert("Error adding skill: " + err.message);
    });
}

function deleteSkill(id) {
    fetch(`${API}/skills/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeaders() }
    })
    .then(() => loadSkills())
    .catch(err => {
        console.error("Error deleting skill:", err);
        alert("Error deleting skill: " + err.message);
    });
}

/* ---------- PROJECTS ---------- */
function toggleloadProjects() {
    loadProjects();
}

function loadProjects() {
    // Ensure section is visible
    const projectsSection = document.getElementById("projects");
    projectsSection.style.display = "block";

    // If not logged in, show hardcoded projects for viewers
    const isAdmin = sessionStorage.getItem("auth");
    if (!isAdmin) {
        displayHardcodedProjects();
        return;
    }

    // If logged in, fetch from API
    fetch(`${API}/projects`)
        .then(r => r.json())
        .then(data => {
            projects.innerHTML = "";
            data.forEach(p => {
                projects.innerHTML += `
                    <div class="project">
                        <h3>${p.title}</h3>
                        <p>${p.description}</p>
                        <a href="${p.links?.link || "#"}" target="_blank">Open</a><br>
                        <button onclick="deleteProject(${p.id})">Delete</button>
                    </div>
                `;
            });
        })
        .catch(err => {
            console.error("Error loading projects:", err);
            alert("Error loading projects: " + err.message);
        });
}

function displayHardcodedProjects() {
    projects.innerHTML = `
        <div class="project">
            <h3>TRAFFIC-SIGNAL-FORECASTING</h3>
            <p>The Traffic Signal Forecasting System is an AI-powered solution designed to predict and optimize traffic light timings based on real-time and historical traffic data. The goal is to reduce congestion, improve traffic flow, and minimize waiting times at intersections. Using Python and Machine Learning algorithms.</p>
            <a href="https://github.com/mohamadzuheer6-gif/TRAFFIC-SIGNAL-FORECAST" target="_blank">Open</a>
        </div>
        <div class="project">
            <h3>MEDICAL-CHATBOT-USING-LLM</h3>
            <p>An AI-powered medical chatbot designed to provide 24/7 symptom analysis, triage, and reliable health information, bridging the gap between patients and primary care.</p>
            <a href="https://github.com/mohamadzuheer6-gif/MEDICAL-CHATBOT" target="_blank">Open</a>
        </div>
    `;
}

function addProject() {
    if (!projTitle.value || !projDesc.value || !projLink.value) {
        alert("Please fill in all project fields");
        return;
    }

    fetch(`${API}/projects`, {
        method: "POST",
        headers: {"Content-Type":"application/json", ...getAuthHeaders()},
        body: JSON.stringify({
            title: projTitle.value,
            description: projDesc.value,
            links: { link: projLink.value }
        })
    })
    .then(() => {
        projTitle.value = "";
        projDesc.value = "";
        projLink.value = "";
        loadProjects();
    })
    .catch(err => {
        console.error("Error adding project:", err);
        alert("Error adding project: " + err.message);
    });
}

function deleteProject(id) {
    fetch(`${API}/projects/${id}`, {
        method: "DELETE",
        headers: {...getAuthHeaders()}
    })
    .then(() => loadProjects())
    .catch(err => {
        console.error("Error deleting project:", err);
        alert("Error deleting project: " + err.message);
    });
}

updateUI();

