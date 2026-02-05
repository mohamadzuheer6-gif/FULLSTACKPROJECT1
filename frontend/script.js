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
  // Logout button
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
        headers: {"Content-Type":"application/json",...getAuthHeaders()},
        body: JSON.stringify({
            name: pName.value,
    .catch(err => {
        console.error("Error saving profile:", err);
        alert("Error saving profile: " + err.message);
    })
            email: pEmail.value,
            education: pEdu.value
        })
    }).then(() => loadProfile());
}

/* ---------- SKILLS ---------- */
function toggleloadSkills() {
    loadSkills();
}

function loadSkills() {
    if (!toggleSection("skills")) return;

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
          
        .catch(err => {
            console.error("Error loading skills:", err);
            alert("Error loading skills: " + err.message);
        })              <button onclick="deleteSkill(${s.id})">❌</button>
                    </li>
                `;
            });
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
    .catch(err => {
        console.error("Error adding skill:", err);
        alert("Error adding skill: " + err.message);
    }).then(() => {
        skillName.value = "";
        skillProf.value = "";
        loadSkills();
    });
}


function deleteSkill(id) {
    .catch(err => {
        console.error("Error deleting skill:", err);
        alert("Error deleting skill: " + err.message);
    })
    fetch(`${API}/skills/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeaders() }
    }).then(() => loadSkills());
}

/* ---------- PROJECTS ---------- */
function toggleloadProjects() {
    loadProjects();
}

function loadProjects() {
    if (!toggleSection("projects")) return;

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

function addProject() {
    fetch(`${API}/projects`, {
        method: "POST",
        headers: {"Content-Type":"application/json", ...getAuthHeaders()},
        body: JSON.stringify({
            title: projTitle.valu
    .catch(err => {
        console.error("Error adding project:", err);
        alert("Error adding project: " + err.message);
    })e,
            description: projDesc.value,
            links: { link: projLink.value }
        })
    }).then(() => loadProjects());
}
        .catch(err => {
            console.error("Error deleting project:", err);
            alert("Error deleting project: " + err.message);
        })

function deleteProject(id) {
    fetch(`${API}/projects/${id}`, { method: "DELETE",headers:{...getAuthHeaders()} })
        .then(() => loadProjects());
}
updateUI();

