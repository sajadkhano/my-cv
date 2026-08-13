// ============================================================
// PORTFOLIO — app.js
// Sajjad Khaldoon Hano  |  OPC Petroleum Engineer & AI Dev
// Features:
//   • Admin/Visitor Mode (localhost = admin, shared = visitor)
//   • Server API for persistent file storage (Flask)
//   • localStorage fallback for offline/static mode
//   • Presentations: upload, view, rename, delete
//   • Context Menu (right-click on sections/images to change)
//   • Section & hero background editing
//   • Profile photo with server persistence
// ============================================================

// Configure PDF.js Worker
if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
}

// ============================================================
// DEFAULT DATA STRUCTURES
// ============================================================

const defaultProjects = [
    {
        id: "hammar-simulation",
        type: "Software Tool / Simulation",
        title: "Hammar IPF Simulation Application",
        shortDesc: "A custom simulation application modeling Inflow Performance Relationship (IPR) and production forecasting for the Hammar field, translating reservoir data into actionable performance predictions.",
        focus: "Reservoir Simulation & Forecasting",
        tags: ["Python", "Simulation", "Production Forecasting", "Dashboard"],
        img: "assets/hammar_dashboard.png",
        detailHTML: `
            <h4>Project Overview</h4>
            <p>The Hammar Inflow Performance Relationship (IPR) Simulation Application is a customized tool designed to evaluate well performance and forecast future oil production in the Hammar reservoir. By integrating static reservoir data with dynamic production records, this application assists engineers in assessing well productivity and identifying bottlenecking in real-time.</p>
            <h4>Simulation Workflow</h4>
            <div class="formula-block">
                [Field Data Input] ➔ [Vogel's IPR Logic Layer] ➔ [Production Curve Forecasting] ➔ [Dashboard Display]
            </div>
            <ul>
                <li><strong>Data Ingestion:</strong> Gathers flowing bottom-hole pressure, static reservoir pressure, and water-cut data.</li>
                <li><strong>Computational Model:</strong> Implements Vogel's and Wiggins' models for multiphase flow calculations.</li>
                <li><strong>Forecasting:</strong> Models decline curve analysis (DCA) under various artificial lift scenarios.</li>
            </ul>
            <h4>Business Value</h4>
            <p>Replaces time-consuming, spreadsheet-based predictions with a unified python dashboard, accelerating decision-making by over 40% and offering highly accurate drawdown forecasts to prevent reservoir damage.</p>
        `
    },
    {
        id: "smart-decision-support",
        type: "AI-assisted Engineering Tool",
        title: "Smart Decision Support System",
        shortDesc: "A decision-support system leveraging AI tools and Python-built dashboards to help engineers navigate complex drilling and production decisions faster and with more confidence.",
        focus: "AI-Driven Decision Optimization",
        tags: ["AI Tools", "Python", "Dashboard Development", "Decision Support"],
        img: "assets/dss_dashboard.png",
        detailHTML: `
            <h4>Project Overview</h4>
            <p>Traditional oil & gas drilling processes involve highly dynamic environments where delayed decisions lead to costly non-productive time (NPT). This Smart Decision Support System acts as a digital advisor, analyzing drilling parameters to warn engineers of potential risks (like pipe sticking or circulation loss) and recommending optimal solutions.</p>
            <h4>Architecture Flow</h4>
            <div class="formula-block">
                Real-Time Mud & ROP Data ➔ AI Predictive Engine ➔ Risk Grading ➔ Actionable Engineer Advice
            </div>
            <h4>Key Features</h4>
            <ul>
                <li><strong>Anomaly Detection:</strong> Monitors Rate of Penetration (ROP), torque, and mud weight patterns.</li>
                <li><strong>Interactive Advisory Grid:</strong> Recommends corrective actions validated by historical offset well datasets.</li>
                <li><strong>Intelligent Assistant:</strong> Merges manual engineering rule-books with LLM agents to resolve complex diagnostics.</li>
            </ul>
        `
    },
    {
        id: "separation-oil-gas",
        type: "Academic / Technical Research",
        title: "Separation in Oil & Gas (Graduation Research)",
        shortDesc: "Graduation research examining separator types and design principles used in oil & gas surface facilities, including material balance analysis for separation efficiency.",
        focus: "Surface Facilities & Thermodynamics",
        tags: ["Separator Design", "Material Balance", "Research"],
        img: "assets/hero_bg.png",
        detailHTML: `
            <h4>Research Scope</h4>
            <p>This graduation research focuses on the mechanics and thermodynamic principles of separating oil, gas, and water in surface production facilities. It reviews horizontal, vertical, and spherical separators, evaluating their design limits and fluid behavior under varying reservoir compositions.</p>
            <h4>Technical Material Balance Equations</h4>
            <div class="formula-block">
                Total Material Balance: F = V + L<br>
                Component Material Balance: F · z_i = V · y_i + L · x_i
            </div>
            <h4>Key Findings</h4>
            <p>Investigated droplet settling velocities using Souders-Brown equations, verifying that horizontal separator configurations outperform vertical designs by up to 25% for high gas-to-oil ratio (GOR) wells in Iraqi fields.</p>
        `
    }
];

const defaultSkills = {
    engineering: [
        { name: "Safety & Firefighting Operations", percent: 90 },
        { name: "Quality Control & Laboratories",   percent: 85 },
        { name: "Pipeline Administrative Management", percent: 80 },
        { name: "Separator Design",                 percent: 80 },
        { name: "Material Balance",                 percent: 85 }
    ],
    tech: [
        { name: "Python Development",               percent: 90 },
        { name: "Dashboard Development",            percent: 85 },
        { name: "AI Tools Integration",             percent: 90 },
        { name: "GitHub Copilot / Prompting",       percent: 95 }
    ]
};

const defaultCerts = [
    { title: "Industrial Fire & Pipeline Safety",   issuer: "OPC Standards", verifyLink: "#" },
    { title: "Quality Control & Chemical Assays",   issuer: "OPC Labs",      verifyLink: "#" },
    { title: "Python for Data Science & AI",        issuer: "Coursera",      verifyLink: "#" }
];

const experienceData = [
    {
        company: "Oil Pipeline Company (OPC)",
        role: "Pipeline Safety, QC Analyst & Administrator",
        duration: "9 Years (2017 - Present)",
        highlights: [
            "<strong>Safety & Firefighting Division (قسم السلامة والإطفاء):</strong> Designed and enforced fire prevention protocols along pipeline corridors, managed emergency suppression rigs, and led safety risk assessments for oil transfer hubs.",
            "<strong>Quality Control & Laboratories Division (قسم السيطرة النوعية والمختبرات):</strong> Performed chemical analyses on fuel, crude oil, and water samples, inspected pipeline corrosion logs, and verified product specifications.",
            "<strong>Administrative Operations (الدور الإداري):</strong> Conducted compliance auditing, managed inter-departmental operations reports, and coordinated certified training programs for new technicians."
        ]
    }
];

const defaultLeadership = [
    {
        id: "lead-1",
        title: "Specialized Technical Trainer",
        org:   "SPE Student Chapter, University of Basrah",
        icon:  "🎓",
        desc:  "Delivered a specialized technical training session for students at the Society of Petroleum Engineers (SPE) Student Chapter, conveying complex engineering and software concepts to bridge academic coursework with actual industry workflows."
    }
];

const learningData = [
    {
        title:  "AI/LLM Applications in Energy",
        status: "Active",
        desc:   "Exploring advanced artificial intelligence and large language model architectures for automated well logs interpretation and field optimization."
    },
    {
        title:  "Advanced Data Analytics",
        status: "Active",
        desc:   "Leveraging Python, Pandas, and SciPy for reservoir simulation and historical production forecasting modeling."
    },
    {
        title:  "Reinforcement Learning for Well Control",
        status: "Planned",
        desc:   "Investigating optimal trajectory drilling control loops using reinforcement learning agents."
    }
];

// Load customisable text/skill/cert/leadership data from localStorage
const _stored_projects   = JSON.parse(localStorage.getItem('portfolio_projects'));
const _stored_skills     = JSON.parse(localStorage.getItem('portfolio_skills'));
const _stored_certs      = JSON.parse(localStorage.getItem('portfolio_certs'));
const _stored_leadership = JSON.parse(localStorage.getItem('portfolio_leadership'));

let projectsData   = (Array.isArray(_stored_projects) && _stored_projects.length > 0)     ? _stored_projects   : defaultProjects;
let skillsData     = (_stored_skills && Object.keys(_stored_skills).length > 0)            ? _stored_skills     : defaultSkills;
let certsData      = (Array.isArray(_stored_certs)    && _stored_certs.length > 0)        ? _stored_certs      : defaultCerts;
let leadershipData = (Array.isArray(_stored_leadership) && _stored_leadership.length > 0) ? _stored_leadership : defaultLeadership;

// --- Persistence & CRUD Helpers ---
function saveLeadershipData() {
    localStorage.setItem('portfolio_leadership', JSON.stringify(leadershipData));
}

function saveSkillsData() {
    localStorage.setItem('portfolio_skills', JSON.stringify(skillsData));
}

function promptAddLeadership() {
    if (!isAdminMode) return;
    const org = prompt("Enter Organization / Institution name (e.g. SPE Chapter, SPE Basrah, OPC Training):");
    if (!org || !org.trim()) return;
    const title = prompt("Enter Training Course / Role Title:", "Technical Trainer & Member");
    if (!title || !title.trim()) return;
    const desc = prompt("Enter Brief Description:", "Conducted technical workshops and training sessions.");
    if (!desc || !desc.trim()) return;
    const icon = prompt("Enter Icon / Emoji (e.g. 🎓, 🏛️, 📜, 💼):", "🎓") || "🎓";

    const newItem = {
        id: `lead-${Date.now()}`,
        org: org.trim(),
        title: title.trim(),
        desc: desc.trim(),
        icon: icon.trim()
    };
    leadershipData.push(newItem);
    saveLeadershipData();
    renderLeadership();
    initInlineEditing();
}

function deleteLeadershipItem(idx) {
    if (!isAdminMode) return;
    if (!confirm('Delete this institution / training item?')) return;
    leadershipData.splice(idx, 1);
    saveLeadershipData();
    renderLeadership();
    initInlineEditing();
}

function updateLeadershipField(idx, field, value) {
    if (leadershipData[idx]) {
        leadershipData[idx][field] = value.trim();
        saveLeadershipData();
    }
}

function promptAddSkill(category) {
    if (!isAdminMode) return;
    const catLabel = category === 'engineering' ? 'Engineering Skills' : 'Tech & Software Skills';
    const skillName = prompt(`Add a new skill to ${catLabel}:`);
    if (!skillName || !skillName.trim()) return;
    if (!skillsData[category]) skillsData[category] = [];
    skillsData[category].push(skillName.trim());
    saveSkillsData();
    renderSkills();
    initInlineEditing();
}

function deleteSkillItem(category, idx) {
    if (!isAdminMode) return;
    if (!confirm('Delete this skill?')) return;
    if (skillsData[category]) {
        skillsData[category].splice(idx, 1);
        saveSkillsData();
        renderSkills();
        initInlineEditing();
    }
}

function updateSkillName(category, idx, value) {
    if (skillsData[category] && skillsData[category][idx] !== undefined) {
        if (typeof skillsData[category][idx] === 'object') {
            skillsData[category][idx].name = value.trim();
        } else {
            skillsData[category][idx] = value.trim();
        }
        saveSkillsData();
    }
}

// Presentations and images will be loaded from server
let presentationsData = [];
let serverImages      = {};
let serverAvailable   = false;
let serverContent     = {};  // editable text content from server
let galleryData       = [];  // gallery photos from server

function fixUrl(url) {
    if (!url) return url;
    if (typeof url !== 'string') return url;
    if (url.startsWith('/uploads/')) return 'uploads/' + url.substring(9);
    if (url.startsWith('/assets/')) return 'assets/' + url.substring(8);
    if (url.startsWith('/') && !url.startsWith('//')) return url.substring(1);
    return url;
}

async function checkServer() {
    try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 2500);
        const res = await fetch('/api/presentations', { signal: ctrl.signal });
        clearTimeout(t);
        serverAvailable = res.ok;
    } catch (_) {
        serverAvailable = false;
    }
}

async function fetchServerImages() {
    if (serverAvailable) {
        try {
            const res = await fetch('/api/images');
            if (res.ok) { serverImages = await res.json(); return; }
        } catch (_) {}
    }
    try {
        const res = await fetch('data/images.json');
        if (res.ok) serverImages = await res.json();
    } catch (_) {}
}

async function fetchPresentations() {
    if (serverAvailable) {
        try {
            const res = await fetch('/api/presentations');
            if (res.ok) { presentationsData = await res.json(); return; }
        } catch (_) {}
    }
    try {
        const res = await fetch('data/presentations.json');
        if (res.ok) { presentationsData = await res.json(); return; }
    } catch (_) {}
    presentationsData = JSON.parse(localStorage.getItem('portfolio_presentations')) || [];
}

async function fetchContent() {
    if (serverAvailable) {
        try {
            const res = await fetch('/api/content');
            if (res.ok) { serverContent = await res.json(); return; }
        } catch (_) {}
    }
    try {
        const res = await fetch('data/content.json');
        if (res.ok) serverContent = await res.json();
    } catch (_) {}
}

async function saveContentKey(key, value) {
    serverContent[key] = value;
    if (serverAvailable) {
        try {
            await fetch('/api/content', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ [key]: value })
            });
            return;
        } catch (_) {}
    }
    // localStorage fallback
    localStorage.setItem(`content_${key}`, value);
}

function applyContent() {
    document.querySelectorAll('[data-content-key]').forEach(el => {
        const key = el.getAttribute('data-content-key');
        const val = serverContent[key] ?? localStorage.getItem(`content_${key}`);
        if (val !== null && val !== undefined) {
            el.textContent = val;
            // If element has a data-href-prefix, update parent anchor href too
            const prefix = el.getAttribute('data-href-prefix');
            if (prefix && el.closest('a')) {
                el.closest('a').href = prefix + val.trim();
            }
        }
    });
}

function initInlineEditing() {
    if (!isAdminMode) return;

    // Clean up previously set editable markers
    document.querySelectorAll('.editable-field').forEach(el => {
        el.removeAttribute('contenteditable');
        el.classList.remove('editable-field');
    });

    document.querySelectorAll('[data-content-key]').forEach(el => {
        // Skip elements inside the context menu or settings panel
        if (el.closest('#admin-context-menu, #settings-panel')) return;

        el.setAttribute('contenteditable', 'true');
        el.classList.add('editable-field');
        el.setAttribute('spellcheck', 'false');

        let savedText = el.textContent.trim();

        el.addEventListener('focus', () => {
            savedText = el.textContent.trim();
            el.classList.add('editing');
        }, { once: false });

        el.addEventListener('blur', () => {
            el.classList.remove('editing');
            const newVal = el.textContent.trim();
            if (newVal === savedText) return;
            const key = el.getAttribute('data-content-key');
            saveContentKey(key, newVal);
            savedText = newVal;
            // Update contact link hrefs if applicable
            const prefix = el.getAttribute('data-href-prefix');
            if (prefix && el.closest('a')) {
                el.closest('a').href = prefix + newVal;
            }
        });

        el.addEventListener('keydown', e => {
            // Enter saves for single-line elements (not p, div)
            if (e.key === 'Enter' && !['P', 'DIV', 'LI'].includes(el.tagName)) {
                e.preventDefault();
                el.blur();
            }
            if (e.key === 'Escape') {
                el.textContent = savedText;
                el.blur();
            }
        });
    });

    // Dynamic Skill items inline edit listener
    document.querySelectorAll('[data-skill-cat]').forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.classList.add('editable-field');
        el.setAttribute('spellcheck', 'false');

        let savedText = el.textContent.trim();
        el.addEventListener('focus', () => {
            savedText = el.textContent.trim();
            el.classList.add('editing');
        });
        el.addEventListener('blur', () => {
            el.classList.remove('editing');
            const newVal = el.textContent.trim();
            if (newVal !== savedText) {
                const cat = el.getAttribute('data-skill-cat');
                const idx = parseInt(el.getAttribute('data-skill-idx'), 10);
                updateSkillName(cat, idx, newVal);
                savedText = newVal;
            }
        });
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                el.blur();
            }
            if (e.key === 'Escape') {
                el.textContent = savedText;
                el.blur();
            }
        });
    });

    // Dynamic Leadership / Institution items inline edit listener
    document.querySelectorAll('[data-lead-idx]').forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.classList.add('editable-field');
        el.setAttribute('spellcheck', 'false');

        let savedText = el.textContent.trim();
        el.addEventListener('focus', () => {
            savedText = el.textContent.trim();
            el.classList.add('editing');
        });
        el.addEventListener('blur', () => {
            el.classList.remove('editing');
            const newVal = el.textContent.trim();
            if (newVal !== savedText) {
                const idx = parseInt(el.getAttribute('data-lead-idx'), 10);
                const field = el.getAttribute('data-lead-field');
                updateLeadershipField(idx, field, newVal);
                savedText = newVal;
            }
        });
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !['P', 'DIV'].includes(el.tagName)) {
                e.preventDefault();
                el.blur();
            }
            if (e.key === 'Escape') {
                el.textContent = savedText;
                el.blur();
            }
        });
    });
}

// ============================================================
// GALLERY MODULE
// ============================================================

async function fetchGallery() {
    if (!serverAvailable) return;
    try {
        const res = await fetch('/api/gallery');
        if (res.ok) galleryData = await res.json();
    } catch (_) {}
}

async function uploadGalleryPhotos(files) {
    if (!serverAvailable) {
        alert('Server is not running. Please start python server.py first.');
        return;
    }
    const promises = Array.from(files).map(file => {
        const fd = new FormData();
        fd.append('file', file);
        return fetch('/api/upload/gallery', { method: 'POST', body: fd })
            .then(r => r.ok ? r.json() : null)
            .catch(() => null);
    });
    const results = await Promise.all(promises);
    results.forEach(batch => {
        if (Array.isArray(batch)) galleryData.push(...batch);
        else if (batch)           galleryData.push(batch);
    });
    renderGallery();
    initInlineEditing();
}

async function deleteGalleryPhoto(id) {
    if (!isAdminMode) return;
    if (!confirm('Delete this photo?')) return;
    try {
        await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    } catch (_) {}
    galleryData = galleryData.filter(p => p.id !== id);
    renderGallery();
}

function openGalleryLightbox(id) {
    const photo = galleryData.find(p => p.id === id);
    if (!photo) return;

    const overlay = document.createElement('div');
    overlay.className = 'gallery-lightbox';
    overlay.innerHTML = `
        <div class="lightbox-inner">
            <button class="lightbox-close" onclick="this.closest('.gallery-lightbox').remove()">&times;</button>
            <img src="${photo.url}" alt="${photo.caption || ''}" class="lightbox-img">
            ${photo.caption ? `<p class="lightbox-caption">${photo.caption}</p>` : ''}
        </div>
    `;
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));
}

function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    if (galleryData.length === 0) {
        grid.innerHTML = `
            <div class="gallery-empty reveal">
                <div style="font-size:3rem;margin-bottom:1rem;">🖼️</div>
                <p>${isAdminMode ? 'Use the upload area above to add photos to your gallery.' : 'No photos have been added yet.'}</p>
            </div>`;
        return;
    }

    grid.innerHTML = galleryData.map(photo => `
        <div class="gallery-photo-card reveal">
            <div class="gallery-photo-wrap" onclick="openGalleryLightbox('${photo.id}')">
                <img src="${photo.url}" alt="${photo.caption || 'Gallery photo'}" loading="lazy" class="gallery-photo-img">
                <div class="gallery-photo-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                </div>
            </div>
            ${photo.caption ? `<p class="gallery-photo-caption">${photo.caption}</p>` : ''}
            <button class="gallery-delete-btn admin-only" onclick="deleteGalleryPhoto('${photo.id}')" title="Delete photo">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
        </div>
    `).join('');

    // Ensure admin-only elements are visible/hidden correctly
    document.querySelectorAll('.gallery-delete-btn').forEach(btn => {
        btn.style.display = isAdminMode ? 'flex' : 'none';
    });
}

// Wire up gallery upload
function initGalleryUpload() {
    const dropzone  = document.getElementById('gallery-dropzone');
    const fileInput = document.getElementById('gallery-file-input');
    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => {
        if (e.target.files.length) uploadGalleryPhotos(e.target.files);
        fileInput.value = '';
    });
    dropzone.addEventListener('dragover', e => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', e => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) uploadGalleryPhotos(e.dataTransfer.files);
    });
}

async function uploadImageToServer(key, file) {
    if (!serverAvailable) return null;
    try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('key', key);
        const res = await fetch('/api/upload/image', { method: 'POST', body: fd });
        if (res.ok) {
            const data = await res.json();
            serverImages[key] = data.url;
            return data.url;
        }
    } catch (_) {}
    return null;
}

async function deleteImageFromServer(key) {
    if (!serverAvailable) return;
    try {
        await fetch(`/api/images/${key}`, { method: 'DELETE' });
        delete serverImages[key];
    } catch (_) {}
}

// ============================================================
// ADMIN vs VISITOR MODE
// ============================================================

let isAdminMode = false;

function checkAdminMode() {
    const params       = new URLSearchParams(window.location.search);
    const isLocal      = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
    const forceVisitor = params.has('visitor') || params.has('preview');
    const forceAdmin   = params.has('edit')    || params.has('admin') ||
                         localStorage.getItem('portfolio_admin_mode') === 'true';

    isAdminMode = (isLocal || forceAdmin) && !forceVisitor;

    document.body.classList.toggle('admin-mode', isAdminMode);
    console.log(isAdminMode ? '🔑 Admin Mode Active' : '👁️ Visitor Mode');
    return isAdminMode;
}

// ============================================================
// PROFILE PHOTO (server-persistent + localStorage fallback)
// ============================================================

const profilePhotoCircle = document.getElementById('profile-photo-circle');
const profilePhotoInput  = document.getElementById('profile-photo-input');
const profilePlaceholder = document.getElementById('profile-placeholder');

function initProfilePhoto() {
    const src = fixUrl(serverImages['profile']) || localStorage.getItem('portfolio_profile_photo');
    if (src && profilePhotoCircle) {
        profilePhotoCircle.style.backgroundImage = `url(${fixUrl(src)})`;
        if (profilePlaceholder) profilePlaceholder.style.opacity = '0';
    }
}

function removeProfilePhoto() {
    if (profilePhotoCircle) {
        profilePhotoCircle.style.backgroundImage = '';
        if (profilePlaceholder) profilePlaceholder.style.opacity = '1';
    }
    localStorage.removeItem('portfolio_profile_photo');
    deleteImageFromServer('profile');
}

if (profilePhotoCircle && profilePhotoInput) {
    profilePhotoCircle.addEventListener('click', () => {
        if (isAdminMode) profilePhotoInput.click();
    });

    profilePhotoInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const dataUrl = ev.target.result;
            profilePhotoCircle.style.backgroundImage = `url(${dataUrl})`;
            if (profilePlaceholder) profilePlaceholder.style.opacity = '0';
            localStorage.setItem('portfolio_profile_photo', dataUrl);
            // persist to server for visitors
            const serverUrl = await uploadImageToServer('profile', file);
            if (serverUrl) profilePhotoCircle.style.backgroundImage = `url(${serverUrl})`;
        };
        reader.readAsDataURL(file);
    });
}

// ============================================================
// PROJECT IMAGES (server-persistent)
// ============================================================

let currentEditingProjectId = null;
const projectImgFileInput   = document.getElementById('project-img-file-input');

function triggerProjectImgUpload(id) {
    if (!isAdminMode) return;
    currentEditingProjectId = id;
    if (projectImgFileInput) projectImgFileInput.click();
}

if (projectImgFileInput) {
    projectImgFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file || !currentEditingProjectId) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const dataUrl    = ev.target.result;
            const projIndex  = projectsData.findIndex(p => p.id === currentEditingProjectId);
            if (projIndex !== -1) {
                const serverUrl = await uploadImageToServer(`project_${currentEditingProjectId}`, file);
                projectsData[projIndex].img = serverUrl || dataUrl;
                localStorage.setItem('portfolio_projects', JSON.stringify(projectsData));
                renderProjects();
            }
            currentEditingProjectId = null;
            projectImgFileInput.value = '';
        };
        reader.readAsDataURL(file);
    });
}

// ============================================================
// THEME MANAGEMENT
// ============================================================

const themeToggleBtn = document.getElementById('theme-toggle');
const themeSun       = document.getElementById('theme-sun');
const themeMoon      = document.getElementById('theme-moon');

function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcons(saved);
}

function updateThemeIcons(theme) {
    if (themeSun)  themeSun.style.display  = theme === 'dark' ? 'block' : 'none';
    if (themeMoon) themeMoon.style.display = theme === 'dark' ? 'none'  : 'block';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcons(next);
    });
}

// ============================================================
// SETTINGS / CUSTOMISER PANEL
// ============================================================

const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel  = document.getElementById('settings-panel');

if (settingsToggle && settingsPanel) {
    settingsToggle.addEventListener('click', () => {
        settingsPanel.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (!settingsPanel.contains(e.target) && e.target !== settingsToggle) {
            settingsPanel.classList.remove('active');
        }
    });
}

// ============================================================
// BACKGROUND IMAGE (server-persistent + localStorage fallback)
// ============================================================

const bgPresetButtons = document.querySelectorAll('.bg-preset-btn');
const bgUploadInput   = document.getElementById('bg-upload');

const backgroundThemes = {
    'default':      "url('assets/hero_bg.png')",
    'teal-gradient':"linear-gradient(180deg, #0B1E33 0%, #004d40 100%)",
    'cyber-grid':   "linear-gradient(rgba(8,18,30,0.95), rgba(8,18,30,0.95)), linear-gradient(to right, rgba(0,229,201,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,229,201,0.06) 1px, transparent 1px)"
};

function initBackground() {
    // Server image takes priority, then localStorage
    const serverBg = fixUrl(serverImages['hero_bg']);
    const localBg  = localStorage.getItem('portfolio_custom_bg');
    const preset   = localStorage.getItem('portfolio_preset_bg') || 'default';

    if (serverBg) {
        document.documentElement.style.setProperty('--hero-bg-url', `url(${fixUrl(serverBg)})`);
        bgPresetButtons.forEach(b => b.classList.remove('active'));
    } else if (localBg) {
        document.documentElement.style.setProperty('--hero-bg-url', `url(${localBg})`);
        bgPresetButtons.forEach(b => b.classList.remove('active'));
    } else {
        applyPresetBg(preset);
    }
}

function applyPresetBg(name) {
    const val = backgroundThemes[name] || backgroundThemes['default'];
    document.documentElement.style.setProperty('--hero-bg-url', val);
    const heroSec = document.querySelector('.hero-section');
    if (heroSec) {
        heroSec.style.backgroundSize = name === 'cyber-grid' ? 'cover, 40px 40px, 40px 40px' : 'cover';
    }
    bgPresetButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-bg') === name));
    localStorage.removeItem('portfolio_custom_bg');
    localStorage.setItem('portfolio_preset_bg', name);
}

bgPresetButtons.forEach(btn => {
    btn.addEventListener('click', () => applyPresetBg(btn.getAttribute('data-bg')));
});

if (bgUploadInput) {
    bgUploadInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const dataUrl = ev.target.result;
            document.documentElement.style.setProperty('--hero-bg-url', `url(${dataUrl})`);
            bgPresetButtons.forEach(b => b.classList.remove('active'));
            localStorage.setItem('portfolio_custom_bg', dataUrl);
            localStorage.removeItem('portfolio_preset_bg');
            // upload to server for visitors
            const serverUrl = await uploadImageToServer('hero_bg', file);
            if (serverUrl) {
                document.documentElement.style.setProperty('--hero-bg-url', `url(${serverUrl})`);
            }
        };
        reader.readAsDataURL(file);
        bgUploadInput.value = '';
    });
}

// ============================================================
// SKILL SLIDER
// ============================================================

const skillLevelInput = document.getElementById('skill-level-input');
const skillLevelVal   = document.getElementById('skill-level-val');
if (skillLevelInput && skillLevelVal) {
    skillLevelInput.addEventListener('input', () => {
        skillLevelVal.innerText = `${skillLevelInput.value}%`;
    });
}

// ============================================================
// SKILL & CERT ADDER
// ============================================================

const addSkillBtn = document.getElementById('add-skill-btn');
if (addSkillBtn) {
    addSkillBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('skill-name-input');
        const catSelect = document.getElementById('skill-cat-input');
        if (!nameInput.value.trim()) return;
        const skillName = nameInput.value.trim();
        if (!skillsData[catSelect.value]) skillsData[catSelect.value] = [];
        skillsData[catSelect.value].push(skillName);
        saveSkillsData();
        renderSkills();
        initInlineEditing();
        nameInput.value = '';
        alert(`Skill "${skillName}" added!`);
    });
}

const addCertBtn = document.getElementById('add-cert-btn');
if (addCertBtn) {
    addCertBtn.addEventListener('click', () => {
        const nameInput   = document.getElementById('cert-name-input');
        const issuerInput = document.getElementById('cert-issuer-input');
        if (!nameInput.value.trim() || !issuerInput.value.trim()) return;
        const newCert = { title: nameInput.value.trim(), issuer: issuerInput.value.trim(), verifyLink: '#' };
        certsData.push(newCert);
        localStorage.setItem('portfolio_certs', JSON.stringify(certsData));
        renderLearning();
        nameInput.value = '';
        issuerInput.value = '';
        alert(`Certification "${newCert.title}" added!`);
    });
}

// ============================================================
// RESET BUTTON
// ============================================================

function initResetButton() {
    const settingsContent = document.querySelector('.settings-content');
    if (!settingsContent) return;
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-secondary';
    Object.assign(resetBtn.style, {
        width: '100%', marginTop: '1.5rem',
        borderColor: 'var(--secondary-accent)', color: 'var(--secondary-accent)'
    });
    resetBtn.innerText = '⚠️ Reset Portfolio Defaults';
    resetBtn.onclick = () => {
        if (confirm('Reset all customisations? (skills, images, certs, presentations)')) {
            localStorage.clear();
            location.reload();
        }
    };
    settingsContent.appendChild(resetBtn);
}

// ============================================================
// CV CONSOLE — PRESENTATION DECK STYLE (SERVER + LOCALSTORAGE FALLBACK)
// ============================================================

let cvData = null;

async function fetchCV() {
    if (serverAvailable) {
        try {
            const res = await fetch('/api/cv');
            if (res.ok) {
                const data = await res.json();
                if (data && data.fileUrl) {
                    cvData = data;
                    return;
                }
            }
        } catch (_) {}
    }
    try {
        const res = await fetch('data/cv.json');
        if (res.ok) {
            const data = await res.json();
            if (data && data.fileUrl) {
                cvData = data;
                return;
            }
        }
    } catch (_) {}
    // Fallback: localStorage
    const savedCV   = localStorage.getItem('portfolio_cv_file');
    const savedName = localStorage.getItem('portfolio_cv_filename') || 'Sajjad_Khaldoon_Hano_CV.pdf';
    const savedCover= localStorage.getItem('portfolio_cv_cover');
    if (savedCV) {
        cvData = {
            id: 'cv-local',
            title: savedName.replace(/\.[^/.]+$/, ''),
            fileName: savedName,
            fileUrl: null,
            fileData: savedCV,
            coverUrl: savedCover || null,
            mimeType: 'application/pdf',
            uploadedAt: new Date().toISOString()
        };
    } else {
        cvData = null;
    }
}

function renderCV() {
    const wrapper = document.getElementById('cv-console-wrapper');
    if (!wrapper) return;

    if (!cvData) {
        // No CV uploaded
        if (isAdminMode) {
            wrapper.innerHTML = `
                <div class="simple-doc-uploader" id="cv-dropzone" onclick="document.getElementById('cv-file-input').click()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom:8px; color:var(--primary-accent);">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <p>Drag &amp; Drop your CV (PDF) here or <span>browse file</span></p>
                    <input type="file" id="cv-file-input" accept=".pdf,image/*" style="display:none;" onchange="handleCVFileSelect(event)">
                </div>
                <div class="uploader-progress-bar" id="cv-progress-bar" style="display:none;">
                    <div class="progress-bar-fill" id="cv-progress-fill"></div>
                </div>
                <div class="cv-upload-status" id="cv-status" style="display:none; text-align:center;"></div>
            `;
            initCVDropzoneEvents();
        } else {
            wrapper.innerHTML = `
                <div class="cv-deck-card">
                    <div class="cv-slide-preview generated-slide" style="min-height:180px; align-items:center; justify-content:center; text-align:center; padding:2rem;">
                        <div class="slide-header" style="position:absolute; top:1rem; left:1rem; right:1rem;">
                            <span class="slide-logo">OPC.hano</span>
                            <span class="slide-badge">CURRICULUM VITAE</span>
                        </div>
                        <h3 style="font-size:1.25rem; font-weight:700; color:var(--text-primary); margin-top:1rem;">Sajjad Khaldoon Hano</h3>
                        <p style="font-size:0.88rem; color:var(--text-secondary); margin-top:0.3rem;">Petroleum Engineer | Smart Field Solutions &amp; AI Enthusiast</p>
                    </div>
                    <div class="cv-deck-card-actions">
                        <span class="doc-title">Sajjad_Khaldoon_Hano_CV.pdf</span>
                        <div class="cv-action-btn-group">
                            <button class="btn btn-primary" style="padding:0.45rem 1rem; font-size:0.85rem;" onclick="window.print()">
                                📄 View Resume
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        return;
    }

    // CV Exists — Render Presentation Deck Card View
    const coverSrc = fixUrl(cvData.coverUrl || cvData.coverData || null);
    const hasCover = !!coverSrc;
    const bgStyle  = hasCover ? `background-image:url(${coverSrc})` : '';
    const extraCls = hasCover ? '' : 'generated-slide';
    const displayTitle = cvData.fileName || cvData.title || 'Sajjad_Khaldoon_Hano_CV.pdf';

    wrapper.innerHTML = `
        <div class="cv-deck-card">
            <div class="cv-slide-preview ${extraCls}" style="${bgStyle}" onclick="viewCV()">
                ${!hasCover ? `
                    <div class="slide-header">
                        <span class="slide-logo">OPC.hano</span>
                        <span class="slide-badge">CURRICULUM VITAE</span>
                    </div>
                    <div style="margin: auto 0;">
                        <h4 class="slide-title-text" style="font-size:1.3rem;">Sajjad Khaldoon Hano</h4>
                        <p style="font-size:0.85rem; color:var(--primary-accent); margin-top:0.4rem; font-weight:600;">
                            Official Petroleum Engineering Resume
                        </p>
                    </div>
                    <div class="slide-footer">
                        <span>Basra, Iraq</span>
                        <span>Click to Read Online</span>
                    </div>
                ` : ''}
            </div>
            <div class="cv-deck-card-actions">
                <span class="doc-title" title="${displayTitle}">${displayTitle}</span>
                <div class="cv-action-btn-group">
                    <button class="btn btn-secondary" style="padding:0.45rem 0.9rem; font-size:0.85rem;" title="Read Online" onclick="viewCV()">
                        👁️ Read Online
                    </button>
                    <button class="btn btn-primary" style="padding:0.45rem 0.9rem; font-size:0.85rem;" title="Download PDF" onclick="downloadCV()">
                        ⬇️ Download
                    </button>
                    ${isAdminMode ? `
                        <button class="doc-action-btn delete" style="padding:0.4rem; font-size:1.1rem;" title="Delete CV" onclick="deleteCV()">
                            🗑️
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
        ${isAdminMode ? `
            <div class="simple-doc-uploader admin-only" id="cv-dropzone" style="margin-top:1rem; padding:1rem;" onclick="document.getElementById('cv-file-input').click()">
                <p style="font-size:0.85rem; margin:0;">🔄 Click or drag here to <span>replace current CV</span></p>
                <input type="file" id="cv-file-input" accept=".pdf,image/*" style="display:none;" onchange="handleCVFileSelect(event)">
            </div>
            <div class="uploader-progress-bar" id="cv-progress-bar" style="display:none;">
                <div class="progress-bar-fill" id="cv-progress-fill"></div>
            </div>
            <div class="cv-upload-status" id="cv-status" style="display:none; text-align:center;"></div>
        ` : ''}
    `;

    if (isAdminMode) {
        initCVDropzoneEvents();
    }
}

function initCVDropzoneEvents() {
    const dropzone = document.getElementById('cv-dropzone');
    if (!dropzone) return;
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) processUploadedCV(file);
    });
}

function handleCVFileSelect(e) {
    const file = e.target.files[0];
    if (file) processUploadedCV(file);
}

function processUploadedCV(file) {
    const pBar   = document.getElementById('cv-progress-bar');
    const pFill  = document.getElementById('cv-progress-fill');
    const status = document.getElementById('cv-status');

    if (pBar) pBar.style.display = 'block';
    if (status) {
        status.style.display = 'block';
        status.className = 'cv-upload-status';
        status.innerHTML = `⏳ Processing <strong>${file.name}</strong>…`;
    }

    let progress = 0;
    const interval = setInterval(() => {
        progress = Math.min(progress + 5, 80);
        if (pFill) pFill.style.width = `${progress}%`;
    }, 50);

    if (file.type === 'application/pdf') {
        const arrayReader = new FileReader();
        arrayReader.onload = (e) => {
            const loadingTask = pdfjsLib.getDocument({ data: e.target.result });
            loadingTask.promise
                .then(pdf => pdf.getPage(1).then(page => {
                    const scale    = 1.5;
                    const viewport = page.getViewport({ scale });
                    const canvas   = document.createElement('canvas');
                    canvas.width   = viewport.width;
                    canvas.height  = viewport.height;
                    return page.render({ canvasContext: canvas.getContext('2d'), viewport })
                        .promise.then(() => {
                            canvas.toBlob(blob => {
                                clearInterval(interval);
                                uploadCVToServer(file, blob);
                            }, 'image/jpeg', 0.85);
                        });
                }))
                .catch(() => {
                    clearInterval(interval);
                    uploadCVToServer(file, null);
                });
        };
        arrayReader.readAsArrayBuffer(file);
    } else if (file.type.startsWith('image/')) {
        clearInterval(interval);
        uploadCVToServer(file, file);
    } else {
        clearInterval(interval);
        uploadCVToServer(file, null);
    }
}

async function uploadCVToServer(file, coverBlob) {
    const pFill  = document.getElementById('cv-progress-fill');
    const status = document.getElementById('cv-status');

    if (pFill) pFill.style.width = '85%';
    if (status) status.innerHTML = `⏳ Saving CV to server…`;

    if (serverAvailable) {
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('title', file.name.replace(/\.[^/.]+$/, ''));
            if (coverBlob) fd.append('cover', coverBlob, 'cv_cover.jpg');

            const res = await fetch('/api/upload/cv', { method: 'POST', body: fd });
            if (res.ok) {
                cvData = await res.json();
                finishCVUpload(file.name);
                return;
            }
        } catch (err) {
            console.error('Server CV upload failed:', err);
        }
    }

    // LocalStorage fallback
    const reader = new FileReader();
    reader.onload = (ev) => {
        const b64 = ev.target.result;
        const getCover = () => new Promise(resolve => {
            if (!coverBlob || !(coverBlob instanceof Blob)) return resolve(null);
            const r = new FileReader();
            r.onload = (e2) => resolve(e2.target.result);
            r.onerror = () => resolve(null);
            r.readAsDataURL(coverBlob);
        });
        getCover().then(coverB64 => {
            localStorage.setItem('portfolio_cv_file', b64);
            localStorage.setItem('portfolio_cv_filename', file.name);
            if (coverB64) localStorage.setItem('portfolio_cv_cover', coverB64);
            cvData = {
                id: 'cv-local',
                title: file.name.replace(/\.[^/.]+$/, ''),
                fileName: file.name,
                fileUrl: null,
                fileData: b64,
                coverUrl: coverB64 || null,
                mimeType: file.type,
                uploadedAt: new Date().toISOString()
            };
            finishCVUpload(file.name);
        });
    };
    reader.readAsDataURL(file);
}

function finishCVUpload(fileName) {
    renderCV();
    const pBar   = document.getElementById('cv-progress-bar');
    const pFill  = document.getElementById('cv-progress-fill');
    const status = document.getElementById('cv-status');
    if (pFill) pFill.style.width = '100%';
    if (status) {
        status.className = 'cv-upload-status success';
        status.innerHTML = `✓ <strong>${fileName}</strong> uploaded successfully!`;
    }
    setTimeout(() => {
        if (pBar) pBar.style.display = 'none';
        if (pFill) pFill.style.width = '0%';
        if (status) status.style.display = 'none';
    }, 3000);
}

async function deleteCV() {
    if (!isAdminMode) return;
    if (!confirm('Are you sure you want to delete the CV?')) return;

    if (serverAvailable) {
        try {
            await fetch('/api/cv', { method: 'DELETE' });
        } catch (_) {}
    }
    localStorage.removeItem('portfolio_cv_file');
    localStorage.removeItem('portfolio_cv_filename');
    localStorage.removeItem('portfolio_cv_cover');
    cvData = null;
    renderCV();
}

function viewCV() {
    if (!cvData) {
        window.print();
        return;
    }
    if (cvData.fileUrl) {
        window.open(fixUrl(cvData.fileUrl), '_blank');
    } else if (cvData.fileData) {
        const win = window.open();
        if (win) {
            win.document.write(`<iframe src="${cvData.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        } else {
            const a = document.createElement('a');
            a.href = cvData.fileData;
            a.download = cvData.fileName || 'CV.pdf';
            a.click();
        }
    } else {
        window.print();
    }
}

function downloadCV() {
    if (!cvData) {
        window.print();
        return;
    }
    if (cvData.fileUrl) {
        const a = document.createElement('a');
        a.href = fixUrl(cvData.fileUrl);
        a.download = cvData.fileName || 'Sajjad_Khaldoon_Hano_CV.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else if (cvData.fileData) {
        const a = document.createElement('a');
        a.href = cvData.fileData;
        a.download = cvData.fileName || 'Sajjad_Khaldoon_Hano_CV.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        window.print();
    }
}

// ============================================================
// PRESENTATIONS — SERVER-BASED UPLOAD / DELETE / RENAME
// ============================================================

const simpleDocUploader   = document.getElementById('simple-doc-uploader');
const simpleDocFileInput  = document.getElementById('simple-doc-file-input');
const uploaderProgressBar = document.getElementById('uploader-progress-bar');
const progressBarFill     = document.getElementById('progress-bar-fill');
const docUploadStatus     = document.getElementById('doc-upload-status');

if (simpleDocUploader && simpleDocFileInput) {
    simpleDocUploader.addEventListener('click', () => simpleDocFileInput.click());

    simpleDocUploader.addEventListener('dragover', (e) => {
        e.preventDefault();
        simpleDocUploader.classList.add('dragover');
    });
    simpleDocUploader.addEventListener('dragleave', () => {
        simpleDocUploader.classList.remove('dragover');
    });
    simpleDocUploader.addEventListener('drop', (e) => {
        e.preventDefault();
        simpleDocUploader.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) processUploadedPresentation(file);
    });
    simpleDocFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) processUploadedPresentation(file);
    });
}

function processUploadedPresentation(file) {
    if (!uploaderProgressBar) return;

    uploaderProgressBar.style.display = 'block';
    if (docUploadStatus) {
        docUploadStatus.style.display = 'block';
        docUploadStatus.className = 'cv-upload-status';
        docUploadStatus.innerHTML = `⏳ Processing <strong>${file.name}</strong>…`;
    }

    // Animate progress to 80% while processing
    let progress = 0;
    const interval = setInterval(() => {
        progress = Math.min(progress + 4, 80);
        if (progressBarFill) progressBarFill.style.width = `${progress}%`;
    }, 50);

    if (file.type === 'application/pdf') {
        if (docUploadStatus) docUploadStatus.innerHTML = `⚙️ Rendering PDF cover…`;
        const arrayReader = new FileReader();
        arrayReader.onload = (e) => {
            const loadingTask = pdfjsLib.getDocument({ data: e.target.result });
            loadingTask.promise
                .then(pdf => pdf.getPage(1).then(page => {
                    const scale    = 1.5;
                    const viewport = page.getViewport({ scale });
                    const canvas   = document.createElement('canvas');
                    canvas.width   = viewport.width;
                    canvas.height  = viewport.height;
                    return page.render({ canvasContext: canvas.getContext('2d'), viewport })
                        .promise.then(() => {
                            canvas.toBlob(blob => {
                                clearInterval(interval);
                                uploadPresentationToServer(file, blob, file.name);
                            }, 'image/jpeg', 0.85);
                        });
                }))
                .catch(() => {
                    clearInterval(interval);
                    uploadPresentationToServer(file, null, file.name);
                });
        };
        arrayReader.readAsArrayBuffer(file);

    } else if (file.type.startsWith('image/')) {
        clearInterval(interval);
        uploadPresentationToServer(file, file, file.name);

    } else {
        clearInterval(interval);
        uploadPresentationToServer(file, null, file.name);
    }
}

async function uploadPresentationToServer(file, coverBlob, defaultTitle) {
    const title = defaultTitle.replace(/\.[^/.]+$/, '');

    if (progressBarFill) progressBarFill.style.width = '85%';
    if (docUploadStatus) docUploadStatus.innerHTML = `⏳ Saving to server…`;

    if (serverAvailable) {
        try {
            const fd = new FormData();
            fd.append('file',  file);
            fd.append('title', title);
            if (coverBlob) fd.append('cover', coverBlob, 'cover.jpg');

            const res = await fetch('/api/upload/presentation', { method: 'POST', body: fd });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const doc = await res.json();
            presentationsData.push(doc);
            finishPresentationUpload(doc.title);
            return;
        } catch (err) {
            console.error('Server upload failed:', err);
        }
    }

    // ─── Fallback: localStorage (base64) ────────────────────────────────────
    const fileReader = new FileReader();
    fileReader.onload = (ev) => {
        const fileDataUrl = ev.target.result;
        const getCover    = () => new Promise(resolve => {
            if (!coverBlob || !(coverBlob instanceof Blob)) return resolve(null);
            const r = new FileReader();
            r.onload  = (e2) => resolve(e2.target.result);
            r.onerror = () => resolve(null);
            r.readAsDataURL(coverBlob);
        });
        getCover().then(coverDataUrl => {
            const doc = {
                id:        `doc-${Date.now()}`,
                title,
                fileName:  file.name,
                fileUrl:   null,
                fileData:  fileDataUrl,     // legacy
                coverUrl:  null,
                coverData: coverDataUrl,    // legacy
                mimeType:  file.type,
                uploadedAt: new Date().toISOString()
            };
            presentationsData.push(doc);
            localStorage.setItem('portfolio_presentations', JSON.stringify(presentationsData));
            finishPresentationUpload(doc.title);
        });
    };
    fileReader.readAsDataURL(file);
}

function finishPresentationUpload(title) {
    renderPresentations();
    if (progressBarFill) progressBarFill.style.width = '100%';
    if (docUploadStatus) {
        docUploadStatus.className = 'cv-upload-status success';
        docUploadStatus.innerHTML = `✓ <strong>${title}</strong> uploaded successfully!`;
    }
    setTimeout(() => {
        if (uploaderProgressBar) uploaderProgressBar.style.display = 'none';
        if (progressBarFill)     progressBarFill.style.width = '0%';
        if (docUploadStatus)     docUploadStatus.style.display = 'none';
    }, 3000);
    if (simpleDocFileInput) simpleDocFileInput.value = '';
}

async function deletePresentation(id) {
    if (!isAdminMode) return;
    if (!confirm('Delete this presentation?')) return;

    if (serverAvailable) {
        try {
            const res = await fetch(`/api/presentations/${id}`, { method: 'DELETE' });
            if (res.ok) {
                presentationsData = presentationsData.filter(d => d.id !== id);
                renderPresentations();
                return;
            }
        } catch (_) {}
    }
    // localStorage fallback
    presentationsData = presentationsData.filter(d => d.id !== id);
    localStorage.setItem('portfolio_presentations', JSON.stringify(presentationsData));
    renderPresentations();
}

async function renamePresentation(id, currentTitle) {
    if (!isAdminMode) return;
    const newTitle = prompt('Enter a new title:', currentTitle);
    if (!newTitle?.trim() || newTitle.trim() === currentTitle) return;

    if (serverAvailable) {
        try {
            const res = await fetch(`/api/presentations/${id}`, {
                method:  'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ title: newTitle.trim() })
            });
            if (res.ok) {
                const updated = await res.json();
                const idx = presentationsData.findIndex(d => d.id === id);
                if (idx !== -1) presentationsData[idx] = updated;
                renderPresentations();
                return;
            }
        } catch (_) {}
    }
    const idx = presentationsData.findIndex(d => d.id === id);
    if (idx !== -1) {
        presentationsData[idx].title = newTitle.trim();
        localStorage.setItem('portfolio_presentations', JSON.stringify(presentationsData));
        renderPresentations();
    }
}

function openPresentation(id) {
    const doc = presentationsData.find(d => d.id === id);
    if (!doc) return;
    if (doc.fileUrl) {
        window.open(fixUrl(doc.fileUrl), '_blank');
    } else if (doc.fileData) {
        // Legacy base64
        const a = document.createElement('a');
        a.href     = doc.fileData;
        a.download = doc.fileName || 'presentation';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

// Keep backward compat alias
function downloadPresentation(id) { openPresentation(id); }

// ============================================================
// RENDERING ENGINE
// ============================================================

function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    let html = '';
    projectsData.forEach(proj => {
        // Server image takes priority over stored/default
        const imgSrc = fixUrl(serverImages[`project_${proj.id}`] || proj.img);
        html += `
            <div class="project-card reveal">
                <div class="project-img-wrapper">
                    <img src="${imgSrc}" alt="${proj.title}" class="project-img" loading="lazy">
                    <span class="project-overlay">${proj.type}</span>
                    <div class="change-project-img-overlay admin-only" title="Change Image"
                         onclick="triggerProjectImgUpload('${proj.id}')">
                        <span>📷 Change Image</span>
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${proj.title}</h3>
                    <p class="project-desc">${proj.shortDesc}</p>
                    <div class="project-tags">
                        ${proj.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
                    </div>
                    <button class="project-btn" onclick="openProjectModal('${proj.id}')">
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    });
    html += `
        <div class="project-card project-card-placeholder reveal" onclick="location.hash='#contact'">
            <div class="placeholder-icon">+</div>
            <h3 class="project-title">Your Project Here</h3>
            <p class="project-desc" style="margin-top:0.5rem;font-size:0.9rem;">
                Looking to automate field workflows or deploy custom simulators? Let's collaborate.
            </p>
            <span class="project-tag" style="margin-top:1.5rem;display:inline-block;">Open for Collaboration</span>
        </div>
    `;
    grid.innerHTML = html;
}

function renderExperience() {
    const timeline = document.getElementById('experience-timeline');
    if (!timeline) return;
    timeline.innerHTML = experienceData.map(exp => `
        <div class="timeline-item reveal">
            <div class="timeline-node"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <div>
                        <h3 class="company-title">${exp.company}</h3>
                        <div class="job-role">${exp.role}</div>
                    </div>
                    <span class="job-duration">${exp.duration}</span>
                </div>
                <ul class="timeline-list">
                    ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

function renderLeadership() {
    const container = document.getElementById('leadership-container');
    if (!container) return;

    let itemsHtml = '';
    if (!leadershipData || leadershipData.length === 0) {
        itemsHtml = `
            <div class="leadership-empty" style="text-align:left; color:var(--text-secondary); padding:1rem 0;">
                <p>${isAdminMode ? 'Click the button below to add your first training course or institution.' : 'No institutions or training programs added yet.'}</p>
            </div>
        `;
    } else {
        itemsHtml = `
            <div class="leadership-list">
                ${leadershipData.map((lead, idx) => `
                    <div class="leadership-card reveal">
                        <div class="leadership-icon" title="${isAdminMode ? 'Click to edit icon' : ''}" ${isAdminMode ? `contenteditable="true" spellcheck="false" data-lead-idx="${idx}" data-lead-field="icon"` : ''}>${lead.icon || '🎓'}</div>
                        <div class="leadership-body">
                            <span class="leadership-org ${isAdminMode ? 'editable-field' : ''}" ${isAdminMode ? `contenteditable="true" spellcheck="false" data-lead-idx="${idx}" data-lead-field="org"` : ''}>${lead.org}</span>
                            <h3 class="leadership-title ${isAdminMode ? 'editable-field' : ''}" ${isAdminMode ? `contenteditable="true" spellcheck="false" data-lead-idx="${idx}" data-lead-field="title"` : ''}>${lead.title}</h3>
                            <p class="leadership-desc ${isAdminMode ? 'editable-field' : ''}" ${isAdminMode ? `contenteditable="true" spellcheck="false" data-lead-idx="${idx}" data-lead-field="desc"` : ''}>${lead.desc}</p>
                        </div>
                        ${isAdminMode ? `
                            <button class="leadership-delete-btn admin-only" title="Delete Institution / Training" onclick="deleteLeadershipItem(${idx})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                            </button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    let addBtnHtml = '';
    if (isAdminMode) {
        addBtnHtml = `
            <div class="add-leadership-bar admin-only reveal" style="margin-top:1.5rem;">
                <button class="add-leadership-card" onclick="promptAddLeadership()">
                    ➕ Add New Training Course / Institution
                </button>
            </div>
        `;
    }

    container.innerHTML = itemsHtml + addBtnHtml;
}

function renderSkills() {
    const engList  = document.getElementById('engineering-skills-list');
    const techList = document.getElementById('tech-skills-list');

    const makeBulletItem = (sk, category, idx) => {
        const name = typeof sk === 'object' ? (sk.name || '') : sk;
        return `
            <li class="skill-bullet-item">
                <span class="bullet-dot"></span>
                <span class="skill-bullet-name ${isAdminMode ? 'editable-field' : ''}"
                      ${isAdminMode ? `contenteditable="true" spellcheck="false" data-skill-cat="${category}" data-skill-idx="${idx}"` : ''}>${name}</span>
                ${isAdminMode ? `
                    <button class="skill-delete-btn admin-only" title="Delete Skill" onclick="deleteSkillItem('${category}', ${idx})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                ` : ''}
            </li>
        `;
    };

    if (engList) {
        const engItems = (skillsData.engineering || []).map((sk, idx) => makeBulletItem(sk, 'engineering', idx)).join('');
        engList.innerHTML = `
            <ul class="skills-bullet-list">
                ${engItems}
            </ul>
            ${isAdminMode ? `
                <div class="add-skill-bar admin-only">
                    <button class="add-skill-btn-inline" onclick="promptAddSkill('engineering')">
                        ➕ Add Engineering Skill
                    </button>
                </div>
            ` : ''}
        `;
    }

    if (techList) {
        const techItems = (skillsData.tech || []).map((sk, idx) => makeBulletItem(sk, 'tech', idx)).join('');
        techList.innerHTML = `
            <ul class="skills-bullet-list">
                ${techItems}
            </ul>
            ${isAdminMode ? `
                <div class="add-skill-bar admin-only">
                    <button class="add-skill-btn-inline" onclick="promptAddSkill('tech')">
                        ➕ Add Tech &amp; Software Skill
                    </button>
                </div>
            ` : ''}
        `;
    }
}

function renderPresentations() {
    const grid = document.getElementById('documents-grid');
    if (!grid) return;

    if (presentationsData.length === 0) {
        grid.innerHTML = `
            <div class="project-card project-card-placeholder reveal"
                 onclick="if(isAdminMode){document.getElementById('simple-doc-file-input').click()}"
                 style="grid-column:1/-1;min-height:200px;cursor:${isAdminMode ? 'pointer' : 'default'}">
                <div class="placeholder-icon">+</div>
                <h3 class="project-title">No Presentations Yet</h3>
                <p class="project-desc" style="margin-top:0.5rem;font-size:0.9rem;">
                    ${isAdminMode
                        ? 'Drag &amp; Drop a PDF/Image or click here to upload.'
                        : 'No presentations have been uploaded yet.'}
                </p>
            </div>`;
        return;
    }

    grid.innerHTML = presentationsData.map(doc => {
        const coverSrc = fixUrl(doc.coverUrl || doc.coverData || null);
        const hasCover = !!coverSrc;
        const bgStyle  = hasCover ? `background-image:url(${coverSrc})` : '';
        const extraCls = hasCover ? '' : 'generated-slide';
        const safeTitle = doc.title.replace(/'/g, "\\'");

        return `
            <div class="doc-card reveal">
                <div class="doc-slide-preview ${extraCls}" style="${bgStyle}"
                     onclick="openPresentation('${doc.id}')">
                    ${!hasCover ? `
                        <div class="slide-header">
                            <span class="slide-logo">OPC.hano</span>
                            <span class="slide-badge">TECHNICAL</span>
                        </div>
                        <h4 class="slide-title-text">${doc.title}</h4>
                        <div class="slide-footer">
                            <span>By Sajjad K. Hano</span>
                            <span>Slide Page 1</span>
                        </div>
                    ` : ''}
                </div>
                <div class="doc-card-body">
                    <span class="doc-title" title="${doc.title}"
                          onclick="openPresentation('${doc.id}')">${doc.title}</span>
                    <div class="doc-card-actions admin-only">
                        <button class="doc-action-btn" title="Rename"
                                onclick="renamePresentation('${doc.id}','${safeTitle}')">✏️</button>
                        <button class="doc-action-btn delete" title="Delete"
                                onclick="deletePresentation('${doc.id}')">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderLearning() {
    const certsGrid = document.getElementById('certs-grid');
    const roadmap   = document.getElementById('roadmap-list');
    if (certsGrid) {
        certsGrid.innerHTML = certsData.map(c => `
            <div class="cert-card">
                <span class="cert-badge">Credential</span>
                <h4 class="cert-title">${c.title}</h4>
                <p class="cert-issuer">${c.issuer}</p>
                <a href="${c.verifyLink}" class="cert-link">
                    Verify
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                    </svg>
                </a>
            </div>
        `).join('');
    }
    if (roadmap) {
        roadmap.innerHTML = learningData.map(item => `
            <div class="roadmap-item ${item.status === 'Active' ? 'active' : ''}">
                <div class="roadmap-dot"></div>
                <div class="roadmap-content">
                    <div class="roadmap-title">
                        ${item.title}
                        <span class="roadmap-status">${item.status}</span>
                    </div>
                    <p class="roadmap-desc">${item.desc}</p>
                </div>
            </div>
        `).join('');
    }
}

// ============================================================
// SECTION BACKGROUNDS (saved to server & localStorage)
// ============================================================

function applySectionBackgrounds() {
    document.querySelectorAll('main section').forEach(section => {
        const id = section.id;
        if (!id || id === 'home') return;     // hero handled via CSS var
        const key = `section_${id}`;
        const url = serverImages[key] || localStorage.getItem(`portfolio_bg_${key}`);
        if (url) {
            section.style.backgroundImage    = `url(${url})`;
            section.style.backgroundSize     = 'cover';
            section.style.backgroundPosition = 'center';
            section.style.backgroundRepeat   = 'no-repeat';
        }
    });
}

async function setSectionBackground(sectionId, file) {
    const key     = `section_${sectionId}`;
    const section = document.getElementById(sectionId);

    const reader = new FileReader();
    reader.onload = async (ev) => {
        const dataUrl = ev.target.result;
        if (section) {
            Object.assign(section.style, {
                backgroundImage:    `url(${dataUrl})`,
                backgroundSize:     'cover',
                backgroundPosition: 'center'
            });
        }
        localStorage.setItem(`portfolio_bg_${key}`, dataUrl);
        const serverUrl = await uploadImageToServer(key, file);
        if (serverUrl && section) {
            section.style.backgroundImage = `url(${serverUrl})`;
        }
    };
    reader.readAsDataURL(file);
}

async function removeSectionBackground(sectionId) {
    const key     = `section_${sectionId}`;
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.backgroundImage = '';
        section.style.backgroundSize  = '';
    }
    localStorage.removeItem(`portfolio_bg_${key}`);
    await deleteImageFromServer(key);
}

// ============================================================
// RIGHT-CLICK CONTEXT MENU  (Admin Only)
// ============================================================

// Generic hidden input for context menu image actions
const adminImgInput = (() => {
    const el = document.createElement('input');
    el.type   = 'file';
    el.accept = 'image/*';
    el.id     = 'admin-img-input';
    el.style.display = 'none';
    document.body.appendChild(el);
    return el;
})();

// Context menu DOM element
const ctxMenu = (() => {
    const el = document.createElement('div');
    el.className = 'admin-context-menu';
    el.id        = 'admin-context-menu';
    document.body.appendChild(el);
    return el;
})();

let ctxActions       = [];
let ctxPendingAction = null;

function showContextMenu(x, y, actions) {
    if (!actions.length) return;
    ctxActions = actions;

    ctxMenu.innerHTML = actions.map((a, i) => {
        if (a.separator) return `<div class="ctx-separator"></div>`;
        return `<div class="ctx-item" data-idx="${i}">${a.label}</div>`;
    }).join('');

    ctxMenu.style.cssText = `display:block;left:${x}px;top:${y}px;`;

    // Prevent overflow
    requestAnimationFrame(() => {
        const r = ctxMenu.getBoundingClientRect();
        if (r.right  > window.innerWidth)  ctxMenu.style.left = `${x - r.width}px`;
        if (r.bottom > window.innerHeight) ctxMenu.style.top  = `${y - r.height}px`;
    });

    ctxMenu.querySelectorAll('.ctx-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = ctxActions[parseInt(item.dataset.idx)];
            if (action) executeCtxAction(action);
            hideContextMenu();
        });
    });
}

function hideContextMenu() {
    ctxMenu.style.display = 'none';
    ctxActions = [];
}

function getContextActions(target) {
    const actions = [];

    // ── Profile photo ─────────────────────────────────────────────
    if (target.closest('#profile-photo-circle, .profile-uploader-container')) {
        actions.push({ label: '📸 Change Profile Photo', key: 'change_profile' });
        const hasPhoto = serverImages['profile'] || localStorage.getItem('portfolio_profile_photo');
        if (hasPhoto) actions.push({ label: '🗑️ Remove Photo', key: 'remove_profile' });
        return actions;
    }

    // ── Project card image ────────────────────────────────────────
    const projCard = target.closest('.project-card:not(.project-card-placeholder)');
    if (projCard) {
        const btn   = projCard.querySelector('.project-btn');
        const match = btn?.getAttribute('onclick')?.match(/'([^']+)'/);
        if (match) {
            actions.push({
                label: '📷 Change Project Image',
                key:   'change_project_img',
                data:  { projectId: match[1] }
            });
        }
    }

    // ── Section background ────────────────────────────────────────
    const section = target.closest('section');
    if (section) {
        const id = section.id;
        if (id === 'home') {
            actions.push({ label: '🖼️ Change Hero Background',    key: 'change_hero_bg' });
            const hasBg = serverImages['hero_bg'] || localStorage.getItem('portfolio_custom_bg');
            if (hasBg) actions.push({ label: '↩️ Reset Default Background', key: 'reset_hero_bg' });
        } else if (id) {
            const sectionName = id.charAt(0).toUpperCase() + id.slice(1);
            actions.push({
                label: `🖼️ Change "${sectionName}" Background`,
                key:   'change_section_bg',
                data:  { sectionId: id }
            });
            const key    = `section_${id}`;
            const hasBg  = serverImages[key] || section.style.backgroundImage;
            const active = hasBg && hasBg !== '' && hasBg !== 'none';
            if (active) {
                actions.push({
                    label: '🗑️ Remove Section Background',
                    key:   'remove_section_bg',
                    data:  { sectionId: id }
                });
            }
        }
    }

    return actions;
}

function executeCtxAction(action) {
    switch (action.key) {
        case 'change_profile':
            if (profilePhotoInput) profilePhotoInput.click();
            break;
        case 'remove_profile':
            removeProfilePhoto();
            break;
        case 'change_hero_bg':
            if (bgUploadInput) bgUploadInput.click();
            break;
        case 'reset_hero_bg':
            applyPresetBg('default');
            localStorage.removeItem('portfolio_custom_bg');
            deleteImageFromServer('hero_bg');
            break;
        case 'change_project_img':
            triggerProjectImgUpload(action.data.projectId);
            break;
        case 'change_section_bg':
            ctxPendingAction = action;
            adminImgInput.onchange = handleAdminImgSelect;
            adminImgInput.click();
            break;
        case 'remove_section_bg':
            removeSectionBackground(action.data.sectionId);
            break;
    }
}

async function handleAdminImgSelect() {
    const file = adminImgInput.files[0];
    if (!file || !ctxPendingAction) return;
    const action = ctxPendingAction;
    ctxPendingAction = null;
    adminImgInput.value = '';

    if (action.key === 'change_section_bg') {
        await setSectionBackground(action.data.sectionId, file);
    }
}

// Wire up context menu events
document.addEventListener('contextmenu', (e) => {
    if (!isAdminMode) return;
    const actions = getContextActions(e.target);
    if (!actions.length) return;
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, actions);
});

document.addEventListener('click',  (e) => { if (!ctxMenu.contains(e.target)) hideContextMenu(); });
document.addEventListener('scroll', hideContextMenu, { passive: true });
window.addEventListener('resize',   hideContextMenu);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideContextMenu(); });

// ============================================================
// SECTION EDIT OVERLAY BUTTONS  (Admin: floating 🖼️ icons)
// ============================================================

function initSectionEditOverlays() {
    if (!isAdminMode) return;

    document.querySelectorAll('main section').forEach(section => {
        const id = section.id;
        if (!id) return;

        const btn = document.createElement('button');
        btn.className   = 'section-bg-edit-btn admin-only';
        btn.title       = id === 'home' ? 'Change Hero Background' : `Change Section Background`;
        btn.innerHTML   = '🖼️';
        btn.setAttribute('aria-label', 'Change background image');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (id === 'home') {
                bgUploadInput?.click();
            } else {
                ctxPendingAction = { key: 'change_section_bg', data: { sectionId: id } };
                adminImgInput.onchange = handleAdminImgSelect;
                adminImgInput.click();
            }
        });

        section.style.position = section.style.position || 'relative';
        section.appendChild(btn);
    });
}

// ============================================================
// SCROLL & REVEAL ANIMATIONS
// ============================================================

function initReveal() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ============================================================
// MODAL HANDLING
// ============================================================

const modalOverlay = document.getElementById('project-modal');
const modalCloseBtn = document.getElementById('modal-close');

function openProjectModal(id) {
    const proj = projectsData.find(p => p.id === id);
    if (!proj || !modalOverlay) return;
    const imgSrc = serverImages[`project_${id}`] || proj.img;
    document.getElementById('modal-img').src         = imgSrc;
    document.getElementById('modal-img').alt         = proj.title;
    document.getElementById('modal-category').innerText = proj.type;
    document.getElementById('modal-title').innerText    = proj.title;
    document.getElementById('modal-desc').innerHTML     = proj.detailHTML;
    document.getElementById('modal-sidebar-stack').innerText = proj.tags.join(', ');
    document.getElementById('modal-sidebar-focus').innerText = proj.focus;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) closeModal();
});

// ============================================================
// ACTIVE NAV ON SCROLL
// ============================================================

function initNavHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = 'home';
        sections.forEach(sec => {
            if (pageYOffset >= sec.offsetTop - 200) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
        const header = document.getElementById('header');
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ============================================================
// MOBILE NAVIGATION
// ============================================================

const menuToggle = document.getElementById('menu-toggle');
const navMenu    = document.getElementById('nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !expanded);
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============================================================
// APP INITIALISATION (async — loads server data first)
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Determine admin/visitor mode
    checkAdminMode();

    // 2. Apply theme immediately (no async needed)
    initTheme();

    // 3. Check if Flask server is running
    await checkServer();

    // 4. Load ALL server-side data in parallel
    await Promise.all([
        fetchServerImages(),
        fetchPresentations(),
        fetchContent(),
        fetchCV()
    ]);

    // 5. Apply backgrounds (now that serverImages is populated)
    initBackground();
    applySectionBackgrounds();

    // 6. Apply profile photo
    initProfilePhoto();

    // 7. Render CV Console
    renderCV();

    // 8. Render all sections
    renderProjects();
    renderExperience();
    renderLeadership();
    renderSkills();
    renderPresentations();
    renderLearning();

    // 9. Apply saved editable content AFTER rendering
    applyContent();

    // 10. Init inline editing for admin
    initInlineEditing();

    // 12. UI helpers
    initReveal();
    initNavHighlight();
    initResetButton();
    initSectionEditOverlays();

    // 13. Footer year
    const yearSpan = document.getElementById('footer-year');
    if (yearSpan) yearSpan.innerText = new Date().getFullYear();

    // 14. Show server status hint for admin
    if (isAdminMode && !serverAvailable) {
        console.warn(
            '%c Warning: Server not detected. Start with: python server.py',
            'color: orange; font-weight: bold;'
        );
        const badge = document.createElement('div');
        badge.className = 'server-offline-badge';
        badge.textContent = 'Server offline — run: python server.py  |  Changes won\'t be visible to visitors';
        document.body.appendChild(badge);
        setTimeout(() => badge.remove(), 7000);
    }
});

