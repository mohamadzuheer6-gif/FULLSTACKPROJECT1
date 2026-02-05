/* ================= API CONFIG ================= */
const API = window.location.hostname.includes("localhost")
    ? "http://127.0.0.1:8000"
    : "https://fullstackproject1-mmf5.onrender.com";

const ADMIN_KEY = "admin123";

/* ================= AUTH ================= */
function getAuthHeaders() {
    const key = sessionStorage.getItem("auth");
    if (!key) return {};
    return { "X-API-Key": key };
}

/* ================= DOM REFERENCES ================= */
let profileView, skills, projects;
let pName, pEmail, pEdu;
let skillName, skillProf;
let projTitle, projDesc, projLink;

document.addEventListener("DOMContentLoaded", () => {
    profileView = document.getElementById("profileView");
    skills = document.getElementById("skills");
    projects = document.getElementById("projects");

    pName = document.getElementById("pName");
    pEmail = document.getElementById("pEmail");
    pEdu = document.getElementById("pEdu");

    skillName = document.getElementById("skillName");
    skillProf = document.getElementById("skillProf");

    projTitle = document.getElementById("projTitle");
    projDesc = document.getElementById("projDesc");
    projLink = document.getElementById("projLink");

    // 🔥 ensure sections start hidden but toggleable
    [profileView, skills, projects].forEach(el => {
        if (el) el.style.display = "none";
    });

    updateUI();
});

/* ================= LOGIN ================= */
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
    if (logoutBtn) logoutBtn.style.display = loggedIn ? "inline-block" : "none";

    const badge = document.getElementById("adminBadge");
    if (badge) badge.style.display = loggedIn ? "inline-block" : "none";
}

/* ================= TOGGLE (FIXED) ================= */
function toggleSection(id) {
    const el = document.getElementById(id);
    if (!el) return false;

    const isHidden = getComputedStyle(el).display === "none";
    el.style.display = isHidden ? "block" : "none";
    return isHidden;
}

/* ================= PROFILE ================= */
function toggleProfile() {
    if (!toggleSection("profileView")) return;
    loadProfile();
}

function loadProfile() {
    fetch(`${API}/profile`)
        .then(r => {
            if (!r.ok) {
                throw new Error("Profile API failed");
            }
            return r.json();
        })
        .then(p => {
            // p is a plain object (confirmed)
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
            profileView.innerHTML = `
                <p style="color:red">
                    Failed to load profile
                </p>
            `;
            console.error("Profile load error:", err);
        });
}


function saveProfile() {
    fetch(`${API}/profile`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({
            name: pName.value,
            email: pEmail.value,
            education: pEdu.value
        })
    }).then(() => loadProfile());
}

/* ================= SKILLS ================= */
function toggleloadSkills() {
    if (!toggleSection("skills")) return;
    loadSkills();
}

function loadSkills() {
    fetch(`${API}/skills`)
        .then(r => r.json())
        .then(data => {
            skills.innerHTML = "";
            if (!Array.isArray(data)) return;

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
            skills.innerHTML = "<li>Failed to load skills</li>";
            console.error(err);
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
    }).then(() => {
        skillName.value = "";
        skillProf.value = "";
        loadSkills();
    });
}

function deleteSkill(id) {
    fetch(`${API}/skills/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeaders() }
    }).then(() => loadSkills());
}

/* ================= PROJECTS ================= */
function toggleloadProjects() {
    if (!toggleSection("projects")) return;
    loadProjects();
}

function loadProjects() {
    fetch(`${API}/projects`)
        .then(r => r.json())
        .then(data => {
            projects.innerHTML = "";
            if (!Array.isArray(data)) return;

            data.forEach(p => {
                projects.innerHTML += `
                    <div class="project">
                        <h3>${p.title}</h3>
                        <p>${p.description}</p>
                        ${
                            p.links?.link
                                ? `<a href="${p.links.link}" target="_blank">🔗 Open</a><br>`
                                : ""
                        }
                        <button onclick="deleteProject(${p.id})">Delete</button>
                    </div>
                `;
            });
        })
        .catch(err => {
            projects.innerHTML = "<p>Failed to load projects</p>";
            console.error(err);
        });
}

function addProject() {
    fetch(`${API}/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({
            title: projTitle.value.trim(),
            description: projDesc.value.trim(),
            links: { link: projLink.value.trim() }
        })
    }).then(() => {
        projTitle.value = "";
        projDesc.value = "";
        projLink.value = "";
        loadProjects();
    });
}

function deleteProject(id) {
    fetch(`${API}/projects/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeaders() }
    }).then(() => loadProjects());
}
