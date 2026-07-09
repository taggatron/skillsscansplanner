// Core State
let currentStandard = 'l3_outdoor';
let cohortSize = 15;
let totalGLH = 1000;
let durationMonths = 12;

// Ingested/Parsed Data Structures
let rawWorkbookData = null; // Stored parsed sheet structure if uploaded
let cohortScores = []; // Array of arrays: [learnerIdx][rowIdx] = score
let ksbItems = []; // Array of KSB item details
let themeData = []; // Aggregated theme details
let rplLog = []; // RPL details per learner
let posCalendar = []; // Generated PoS calendar modules

// Charts instances
let gapChartInstance = null;
let themeChartInstance = null;

// Fallback Embedded Data (L3 Outdoor Activity Instructor & L2 Leisure Team Member Templates)
// Used when file protocol (file://) is active and relative fetch fails, ensuring absolute reliability.
const FALLBACK_TEMPLATES = {
    l3_outdoor: {
        standardName: "L3 Outdoor Activity Instructor",
        totalKsbCount: 39,
        defaultGLH: 1000,
        fundingBand: 14000,
        themes: ["Session Delivery", "Professional"],
        rows: [
            { id: 1, ksb: "K1, S1, S2", theme: "Session Delivery", desc: "Demonstrate the ability to describe at least 4 key pieces of information they would need to collate and use to deliver a session while also being able to demonstrate planning a session to suit individual needs within the group using a variety of spaces, interactions, roles, mini-groupings, teaching styles, resources, support, tasks, pace, achievement level, etc." },
            { id: 2, ksb: "K2, S3", theme: "Session Delivery", desc: "You can provides evidence of where you have prepared and delivered sessions tailored to suit the group and the defined outcomes for the session." },
            { id: 3, ksb: "K3, S4", theme: "Session Delivery", desc: "Be able to describe at least 3 predictable changes in the environment and approved options to accommodate these." },
            { id: 4, ksb: "K5, S5, S6", theme: "Session Delivery", desc: "Demonstrate how you select the appropriate equipment for the activity, access and set-up the venue location suitable for the session." },
            { id: 5, ksb: "K8", theme: "Session Delivery", desc: "Demonstrate delivering a session to suit the group needs and the defined outcomes for the session, including delivering a differentiated session to meet individual needs within the group using a variety of spaces, interactions, roles, minigroupings, teaching styles, resources, support, tasks, pace, achievement level, etc." },
            { id: 6, ksb: "K9", theme: "Session Delivery", desc: "Demonstrate a level of subject knowledge and practical skills in the activity that is appropriate for the session being delivered" },
            { id: 7, ksb: "K10, B1", theme: "Session Delivery", desc: "Evidence how you deliver appropriate briefing, demonstration and instruction during the session to meet the needs of the group, demonstrating a range of more complex instruction techniques (such as feedback based on observation of performance, or 1:1 coaching on technical, tactical, physical, psychological skills) in order to support an individualised approach." },
            { id: 8, ksb: "K11, B2", theme: "Session Delivery", desc: "Be able to evidence of where you use operational health and safety procedures in order to guide participants to venues, brief them on the session and maintain self and group safety throughout the session." },
            { id: 9, ksb: "S7, S8", theme: "Session Delivery", desc: "Evidence how you assess the skill development of participants in order to provide on-going instruction to encourage further learning and progression for the individual and team." },
            { id: 10, ksb: "S9, S10", theme: "Session Delivery", desc: "Demonstrate how you would identify hazards in the environment and how they would change their delivery to adapt to them. Providing evidence of recommendations they have made to change organisational procedures to improve session delivery or prevent routine problems." },
            { id: 11, ksb: "S11, S12", theme: "Session Delivery", desc: "Be abale to evidence where you have dealt with routine problems so that they do not negatively impact the session." },
            { id: 12, ksb: "S13", theme: "Session Delivery", desc: "Be able to desctibe how you have (or would) use basic First Aid and summon support for incidents or accidents as necessary" },
            { id: 13, ksb: "S14", theme: "Session Delivery", desc: "Be able to demonstrate being punctual, enthusiastic for the organisation, the session and presenting themselves in a manner appropriate to the organisation." },
            { id: 14, ksb: "K15, B4, S18", theme: "Session Delivery", desc: "You can demonstrate how you use set approaches to instructing/teaching in order to meet the learning outcomes for each session. While Identifing during the session learner attributes that may threaten them meeting the session outcomes, and is proactive in making insession changes to their delivery in order to remove the barriers and ensure participation and achievement throughout the session." },
            { id: 15, ksb: "K16, B6, S19", theme: "Session Delivery", desc: "You must be able to demonstrate encouraging individuals and using at least 3 simple techniques to support group engagement in sessions." },
            { id: 16, ksb: "K17, S20", theme: "Session Delivery", desc: "Be able to apply at least 3 different questioning and observation techniques to check progress of learning and show where they changed the pace of the session because of this." },
            { id: 17, ksb: "K18, S24", theme: "Session Delivery", desc: "You can  describe what review techniques and questioning styles they have used to evaluate achievement of the required outcomes of a session." },
            { id: 18, ksb: "K19, S27", theme: "Session Delivery", desc: "Be able to identify 4 areas, which highlight that participants may have additional support requirements and advise on what you have changed in order to support their learning." },
            { id: 19, ksb: "K20", theme: "Session Delivery", desc: "Be able to evidence where you have provided encouragement for participants to continue learning and improving over the session." },
            { id: 20, ksb: "S15", theme: "Session Delivery", desc: "Be able to evidence of where you have dealt with conflict and what actions they took to challenge the behaviour of participants and promote equality and diversity." },
            { id: 21, ksb: "S16", theme: "Session Delivery", desc: "Be able to demonstrate where they have communicated clear and concise instructions to both colleagues and participants in order for them to be able to undertake the activity." },
            { id: 22, ksb: "S17", theme: "Session Delivery", desc: "Evidence how you Imaintain a positive attitude with customers and colleagues throughout the observed session." },
            { id: 23, ksb: "K21, B5", theme: "Session Delivery", desc: "Be able to evidence of where you have completed your activity delivery within the required timescales and ensured that the venue and equipment are returned to the correct areas." },
            { id: 24, ksb: "S21", theme: "Session Delivery", desc: "Be able to demonstrate promoting ongoing use of the outdoors and advising participants on suitable progression routes, with examples how you have prepared individuals and the group for their next activity using the skills, knowledge and learning of the session they have just completed to agree what the next training session should be and identify the key learning requirements for it." },
            { id: 25, ksb: "S22", theme: "Session Delivery", desc: "Evidence how you review an individual’s learning over the session and their personal objectives and then provide feedback and recommendations for further continuous development in order to improve performance." },
            
            { id: 26, ksb: "K4, B3", theme: "Professional", desc: "Be able to explain  why an activity briefing is important and outline where information to support this is gathered from within their organisation." },
            { id: 27, ksb: "K6, K7", theme: "Professional", desc: "Be able to evidence how you use your organisation’s procedures and standards when preparing for and delivering sessions." },
            { id: 28, ksb: "K12", theme: "Professional", desc: "Be able to describe how and why you encourage group members to think about environmental impact and sustainability, and give at least 3 examples of behaviours that preserve or enhance the environment they work in,  and be able to explain how the theory-of-change they use influences the style and content of activity briefings they deliver." },
            { id: 29, ksb: "K13", theme: "Professional", desc: "Be able to describe at least 4 common problems/issues related to working with groups in the outdoors and what you would do to mitigate these." },
            { id: 30, ksb: "K14", theme: "Professional", desc: "Be able to evidence how you would respond to accidents and emergencies that may occur whilst delivering a session." },
            { id: 31, ksb: "K22", theme: "Professional", desc: "Be able to describe at least 3 of your organisation’s products and the target market and potential benefits of each, and provide evidence of recommendations made to the organisation for improvements to operations or session delivery." },
            { id: 32, ksb: "K23", theme: "Professional", desc: "Be able to describe the level of engagement your organisation would expect when working with both colleagues and participants." },
            { id: 33, ksb: "S23", theme: "Professional", desc: "Be able to provide evidence of where you have used participant’s feedback to make an improvement to the session, and showing how you  analyse participants’ feedback and your own self-evaluation in order to improve on the sessions you deliver." },
            { id: 34, ksb: "K24, S25", theme: "Professional", desc: "Be able to describe your organisations policy on equality and diversity and how this is used to encourage participation and inclusion whilst protecting client information." },
            { id: 35, ksb: "K25, S26", theme: "Professional", desc: "Be able to provide evidence of where you handle and use sensitive information to support the preparation of sessions and support their colleagues in delivering them." },
            { id: 36, ksb: "K26, S28", theme: "Professional", desc: "Be able to  describe at least 3 sources of professional development you have used to further develop their knowledge and personal skills." },
            { id: 37, ksb: "S29", theme: "Professional", desc: "Be able to evidence where you have self-evaluatedyour own performance and what actions you have taken as a result of this, and describe your own processes of reflective practice and the resulting professional development activities outside your workplace you have undertaken (and plan to undertake) to support your career progression." }
        ]
    },
    l2_leisure: {
        standardName: "L2 Leisure Team Member",
        totalKsbCount: 58,
        defaultGLH: 1000,
        fundingBand: 14000,
        themes: ["Knowledge Core", "Integrated Professional Application", "Practical Skills Development", "Professional Behaviours & Ethics"],
        rows: [
            // K1 - K23 (Knowledge Core)
            ...Array.from({ length: 23 }, (_, i) => ({
                id: i + 1,
                ksb: `K${i + 1}`,
                theme: "Knowledge Core",
                desc: `Core Knowledge Requirement ${i + 1} for L2 Leisure Team Member.`
            })),
            // Integrated professional application (composite rows 34-44)
            { id: 24, ksb: "K1 K2 K3 K4 K11 K13 K14 K16 K17 K18 K19 K20 K21 K22 S1 S2 S3 S13 S15 S17 B4 B6", theme: "Integrated Professional Application", desc: "Contribute to the marketing plan, delivery or evaluation of strategic marketing activity through the creation of written planning and evaluation documents." },
            { id: 25, ksb: "K5 K9 K10 K12 K18 K19 S4 B1", theme: "Integrated Professional Application", desc: "Use appropriate primary and/or secondary research methods including survey tools and keyword research." },
            { id: 26, ksb: "K1 K4 K11 K18 K20 S1 S2 S4 S9 S13 S15 B4", theme: "Integrated Professional Application", desc: "Use research data to inform marketing decisions, targeting, planning, and delivery." },
            { id: 27, ksb: "K6 K7 K9 K10 K11 K12 K13 K14 K15 K23 S3 S5 S6 S7 S8 S9 B1 B4", theme: "Integrated Professional Application", desc: "Source, create and edit content in collaboration with colleagues for appropriate marketing channels." },
            { id: 28, ksb: "K6 K9 K13 K16 K23 S10 S13 B2", theme: "Integrated Professional Application", desc: "Support and manage the cataloguing of offline and digital marketing materials and assets." },
            { id: 29, ksb: "K6 K7 K9 K10 K12 K15 K18 K19 K21 K22 K23 S5 S6 S7 S11 S13 S14 B1", theme: "Integrated Professional Application", desc: "Publish, monitor and respond to editorial, creative or video content via website, social media, and offline platforms." },
            { id: 30, ksb: "K6 K7 K9 K10 K11 K12 K13 K14 K15 K19 S2 S5 S6 S7 S8 S9 S11 S12 S16 B1 B2 B6", theme: "Integrated Professional Application", desc: "Support the administration of marketing activities, events, PPC campaigns, advertising and PR." },
            { id: 31, ksb: "K9 K21 K22 K23 S10 S12 S13 B1 B3", theme: "Integrated Professional Application", desc: "Use the organisation's customer relationship management system to maintain accurate customer data." },
            { id: 32, ksb: "K6 K7 K8 K10 K12 K19 S2 S5 S8 S11 S14 S18 B1 B3 B5", theme: "Integrated Professional Application", desc: "Identify and use relevant/emerging trends, solutions and technologies to implement effective marketing activities." },
            { id: 33, ksb: "K11 K16 K18 K19 S12 S13 S15", theme: "Integrated Professional Application", desc: "Contribute to the monitoring of marketing expenditure and activities to a specified budget and plan." },
            { id: 34, ksb: "K11 K12 K13 K14 K16 K17 K20 K21 K22 S4 S6 S12 S13 S16 S17 S18 B1 B6", theme: "Integrated Professional Application", desc: "Monitor, optimise, analyse and evaluate marketing campaigns and channels in order to deliver on objectives." },
            // S1 - S18 (Practical Skills)
            ...Array.from({ length: 18 }, (_, i) => ({
                id: i + 35,
                ksb: `S${i + 1}`,
                theme: "Practical Skills Development",
                desc: `Core Skill Requirement ${i + 1} for L2 Leisure Team Member.`
            })),
            // B1 - B6 (Behaviours)
            ...Array.from({ length: 6 }, (_, i) => ({
                id: i + 53,
                ksb: `B${i + 1}`,
                theme: "Professional Behaviours & Ethics",
                desc: `Core Behaviour Requirement ${i + 1} for L2 Leisure Team Member.`
            }))
        ]
    }
};

// Realistic baseline profiles for simulated scores
// Helps generate natural-looking gaps for the cohort (0-10 scores)
const SIMULATION_PROFILES = {
    l3_outdoor: {
        // High weights (low scores) represent significant gap areas
        K10: { mean: 2.1, sd: 1.0 }, // Briefing techniques (High priority)
        B1: { mean: 2.4, sd: 1.2 },  // Support individualised approach (High priority)
        K3: { mean: 3.1, sd: 1.1 },  // Environmental changes
        S4: { mean: 3.5, sd: 1.4 },  // Predictable changes
        K15: { mean: 3.8, sd: 1.0 }, // Set approaches to teaching
        B4: { mean: 4.2, sd: 0.9 },  // Learner attributes/barriers
        // Low weights (high scores) represent prior experience / strengths
        K1: { mean: 9.2, sd: 0.6 },  // Group planning (Some score 10 - RPL)
        S1: { mean: 8.9, sd: 0.8 },  
        S2: { mean: 8.8, sd: 0.8 },
        K6: { mean: 8.5, sd: 0.7 },  // Organisation procedures
        K7: { mean: 8.4, sd: 0.8 },
        // All others fall in general default range (4-7)
        default: { mean: 5.8, sd: 1.5 }
    },
    l2_leisure: {
        K19: { mean: 2.5, sd: 1.1 }, // Regulatory & GDPR
        S13: { mean: 2.8, sd: 0.9 }, // Technology and day-to-day software
        B6: { mean: 3.2, sd: 1.2 },  // Integrity & confidentiality
        S18: { mean: 3.5, sd: 1.3 }, // Data analysis tools
        K1: { mean: 9.1, sd: 0.7 },  // Marketing theory concepts
        S1: { mean: 8.9, sd: 0.8 },
        default: { mean: 6.0, sd: 1.4 }
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    triggerSimulation(); // Generate initial view
});

// Event Handlers Setup
function setupEventListeners() {
    // Select standard
    document.getElementById('standard-select').addEventListener('change', (e) => {
        currentStandard = e.target.value;
        const uploadSect = document.getElementById('upload-section');
        const paramSect = document.getElementById('parameters-section');
        
        if (currentStandard === 'custom') {
            uploadSect.style.display = 'block';
            paramSect.style.display = 'none';
        } else {
            uploadSect.style.display = 'block';
            paramSect.style.display = 'block';
            // Update default GLH if standard template exists
            const temp = FALLBACK_TEMPLATES[currentStandard];
            if (temp) {
                document.getElementById('total-glh').value = temp.defaultGLH;
            }
        }
        
        // Reset uploaded files log
        document.getElementById('uploaded-files-list').innerHTML = '';
        rawWorkbookData = null;
        
        triggerSimulation();
    });

    // Range input value updater
    const range = document.getElementById('cohort-size');
    const rangeVal = document.getElementById('cohort-size-val');
    range.addEventListener('input', (e) => {
        rangeVal.textContent = e.target.value;
        cohortSize = parseInt(e.target.value);
    });

    // Generate / Simulate Button
    document.getElementById('btn-generate').addEventListener('click', () => {
        totalGLH = parseInt(document.getElementById('total-glh').value) || 1000;
        durationMonths = parseInt(document.getElementById('timeline-months').value) || 12;
        triggerSimulation();
    });

    // Tab Navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').removeActive(); // custom or manual loop
            btn.classList.add('active');
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            // Show current tab content
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // File Drag & Drop Ingestion
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleUploadedFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleUploadedFiles(e.target.files);
    });

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const body = document.body;
        const icon = document.getElementById('theme-icon');
        const text = document.getElementById('theme-text');
        
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            icon.textContent = '🌙';
            text.textContent = 'Switch to Dark Mode';
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            icon.textContent = '☀️';
            text.textContent = 'Switch to Light Mode';
        }
        
        // Re-render charts with updated theme colors
        if (ksbItems.length > 0) {
            renderCharts();
        }
    });

    // Dynamic Search & Filters in KSB table
    document.getElementById('ksb-search').addEventListener('input', filterKSBTable);
    document.getElementById('priority-filter').addEventListener('change', filterKSBTable);

    // Export Buttons Copy/Download
    document.getElementById('btn-copy-dynamics').addEventListener('click', () => copyToClipboard('dynamics-payload-code'));
    document.getElementById('btn-download-dynamics').addEventListener('click', () => downloadJSON('dynamics-payload-code', 'dynamics_onefile_payload.json'));
    
    document.getElementById('btn-copy-word').addEventListener('click', () => copyToClipboard('word-payload-code'));
    document.getElementById('btn-download-word').addEventListener('click', () => downloadJSON('word-payload-code', 'word_template_hydration.json'));
}

// Custom selector extensions for ease of use
Element.prototype.removeActive = function() {
    // helper placeholder if needed
};
NodeList.prototype.removeActive = function() {
    this.forEach(el => el.classList.remove('active'));
};

// File Upload Handler (SheetJS Excel parsing)
function handleUploadedFiles(files) {
    if (files.length === 0) return;
    
    const fileListEl = document.getElementById('uploaded-files-list');
    fileListEl.innerHTML = '';
    
    const validFiles = Array.from(files).filter(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        return ext === 'xlsx' || ext === 'xls';
    });

    if (validFiles.length === 0) {
        alert("Please upload valid Excel file (.xlsx or .xls)");
        return;
    }

    let parsedFilesCount = 0;
    const cohortScansData = []; // Array of processed learner scans
    
    // UI Loading state
    document.getElementById('status-text').textContent = "Ingesting files...";
    document.getElementById('status-text').previousElementSibling.className = "status-dot orange";

    validFiles.forEach((file, idx) => {
        // Render file item in sidebar log
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
            <span class="file-name" title="${file.name}">📄 ${file.name}</span>
            <span class="file-status">Parsing...</span>
        `;
        fileListEl.appendChild(item);

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // Parse workbook data
                const parsedScan = parseWorkbookScan(workbook, file.name);
                cohortScansData.push(parsedScan);
                
                item.querySelector('.file-status').textContent = '✅ Parsed';
                item.querySelector('.file-status').style.color = 'var(--color-green)';
            } catch (err) {
                console.error(err);
                item.querySelector('.file-status').textContent = '❌ Error';
                item.querySelector('.file-status').style.color = 'var(--color-red)';
            }

            parsedFilesCount++;
            if (parsedFilesCount === validFiles.length) {
                // All files parsed, run the cohort analysis
                processUploadedCohort(cohortScansData);
            }
        };
        reader.readAsArrayBuffer(file);
    });
}

// Ingest workbook using SheetJS
function parseWorkbookScan(workbook, filename) {
    // 1. Identify sheet names
    const blankSheetName = workbook.SheetNames.find(name => name.toLowerCase() === 'blank' || name.toLowerCase() === 'skills scan') || workbook.SheetNames[0];
    const rplSheetName = workbook.SheetNames.find(name => name.toLowerCase().includes('rpl') || name.toLowerCase().includes('calculator'));
    
    const blankSheet = workbook.Sheets[blankSheetName];
    // Convert to JSON row-by-row mapping
    const rows = XLSX.utils.sheet_to_json(blankSheet, { header: 1, defval: "" });
    
    // Extract standard title from row 2 cell C2 (C is index 2, row 2 is index 1)
    let standardTitle = "Custom App Standard";
    if (rows[1] && rows[1][2]) {
        standardTitle = rows[1][2].replace("Skills Scan:", "").replace("Skills Scan :", "").trim();
    }

    // Extract KSB rows & scores
    // Scan Column B for KSB references, Column C for desc, Column D for scores
    const items = [];
    let currentTheme = "General Module";
    
    // We expect headers at row 9 (index 8). Data starts at row 10 (index 9)
    for (let idx = 9; idx < rows.length; idx++) {
        const row = rows[idx];
        if (!row || row.length === 0) continue;
        
        const colB = String(row[1] || "").trim(); // Column B
        const colC = String(row[2] || "").trim(); // Column C
        const colD = String(row[3] || "").trim(); // Column D (Learner Score)
        
        // Parse KSB codes (Format B: multiple codes separated by commas/spaces)
        const ksbCodes = colB.match(/[KSBksb]\d+/g);
        
        if (ksbCodes && ksbCodes.length > 0) {
            // This is a KSB score row!
            // Clean up codes (make uppercase)
            const cleanCodes = ksbCodes.map(code => code.toUpperCase());
            const scoreVal = colD !== "" ? parseFloat(colD) : null; // Can be empty
            
            items.push({
                rowIdx: idx + 1,
                ksbCodes: cleanCodes,
                desc: colC,
                theme: currentTheme,
                score: scoreVal
            });
        } else if (colB && !colC && colB.length > 2) {
            // Row has text in B, empty C. It is a theme header!
            currentTheme = colB;
        }
    }

    // Extract default variables from RPL Calculator Sheet if available
    let totalGLHVal = 1000;
    let standardVal = 14000;
    
    if (rplSheetName) {
        const rplSheet = workbook.Sheets[rplSheetName];
        const rplRows = XLSX.utils.sheet_to_json(rplSheet, { header: 1, defval: "" });
        // Cell C4 (C is index 2, row 4 is index 3)
        if (rplRows[3] && rplRows[3][2]) {
            totalGLHVal = parseInt(rplRows[3][2]) || 1000;
        }
        // Cell C10 (C is index 2, row 10 is index 9)
        if (rplRows[9] && rplRows[9][2]) {
            standardVal = parseFloat(rplRows[9][2]) || 14000;
        }
    }

    // Extract Learner Name from file name or signature cells
    let learnerName = filename.replace(/\.[^/.]+$/, ""); // strip extension
    // Look in signatures row 11 column H (index 7) or similar
    if (rows[10] && rows[10][7]) {
        learnerName = String(rows[10][7]).trim();
    }

    return {
        learnerName,
        standardTitle,
        totalGLHVal,
        standardVal,
        items
    };
}

// Ingest multiple uploads
function processUploadedCohort(scans) {
    if (scans.length === 0) return;
    
    // Use data from first scan as structural baseline (KSB rows & themes)
    const baseline = scans[0];
    currentStandard = "custom";
    cohortSize = scans.length;
    totalGLH = baseline.totalGLHVal;
    
    // Set badge & title in header
    document.getElementById('standard-badge').textContent = baseline.standardTitle;
    document.getElementById('standard-title').textContent = `${baseline.standardTitle} Cohort Curriculum Analysis`;
    
    // Map scores matrix
    // cohortScores[learnerIdx][rowIdx] = score
    cohortScores = [];
    scans.forEach(scan => {
        const learnerScores = scan.items.map(it => it.score !== null ? it.score : 0);
        cohortScores.push(learnerScores);
    });

    // Populate ksb rows structural definition
    const parsedRows = baseline.items.map((it, idx) => ({
        id: idx + 1,
        ksb: it.ksbCodes.join(', '),
        theme: it.theme,
        desc: it.desc
    }));
    
    executeAnalysisEngine(parsedRows, baseline.standardVal);
}

// Trigger simulation of cohort scores using template schemas
function triggerSimulation() {
    const template = FALLBACK_TEMPLATES[currentStandard];
    if (!template) return;
    
    document.getElementById('status-text').textContent = "Analyzing cohort...";
    document.getElementById('status-text').previousElementSibling.className = "status-dot orange";

    document.getElementById('standard-badge').textContent = template.standardName;
    document.getElementById('standard-title').textContent = `${template.standardName} Cohort Curriculum Analysis`;

    // 1. Generate cohortScores matrix (simulated)
    cohortScores = [];
    const profile = SIMULATION_PROFILES[currentStandard] || { default: { mean: 6.0, sd: 1.5 } };
    
    for (let learner = 0; learner < cohortSize; learner++) {
        const learnerScores = [];
        
        template.rows.forEach(row => {
            // Find simulation profile for this row
            // Check if any mapped KSB code has a specific profile
            const rowKsbCodes = row.ksb.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
            let profileKey = 'default';
            for (const code of rowKsbCodes) {
                if (profile[code]) {
                    profileKey = code;
                    break;
                }
            }
            
            const prof = profile[profileKey] || profile['default'];
            let score = generateRandomNormalScore(prof.mean, prof.sd);
            
            // Introduce some random 10s (exemptions) and 0s
            const r = Math.random();
            if (r < 0.05) score = 10;
            else if (r < 0.02) score = 0;
            
            learnerScores.push(score);
        });
        cohortScores.push(learnerScores);
    }

    executeAnalysisEngine(template.rows, template.fundingBand);
}

// Generate scores following normal-like distribution, clipped between 0 and 10
function generateRandomNormalScore(mean, sd) {
    // Box-Muller transform
    const u1 = Math.random() || 0.0001; // Avoid 0
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    let val = Math.round(mean + z0 * sd);
    return Math.max(0, Math.min(10, val));
}

// Data Analysis & Hours Allocation Engine
function executeAnalysisEngine(rows, fundingBand = 14000) {
    // 1. Extract KSB codes uniquely and calculate cohort aggregations per KSB item
    // In Format B, one row maps to multiple KSB items (e.g. K1, S1, S2).
    // Let's first build mapping: KSB Code -> list of rows that reference it
    const ksbToRowsMap = {};
    rows.forEach((row, rowIdx) => {
        const codes = row.ksb.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
        codes.forEach(code => {
            const cleanCode = code.trim().toUpperCase();
            if (!ksbToRowsMap[cleanCode]) ksbToRowsMap[cleanCode] = [];
            ksbToRowsMap[cleanCode].push({ rowIdx, rowDesc: row.desc, theme: row.theme });
        });
    });

    // 2. Compute individual KSB score averages & SDs across the cohort
    ksbItems = [];
    
    Object.keys(ksbToRowsMap).forEach(code => {
        const rowRefs = ksbToRowsMap[code];
        
        // For each learner, get their score for this KSB item (average of referencing row scores)
        const learnerScoresForKsb = [];
        for (let l = 0; l < cohortSize; l++) {
            let sum = 0;
            rowRefs.forEach(ref => {
                sum += cohortScores[l][ref.rowIdx];
            });
            learnerScoresForKsb.push(sum / rowRefs.length);
        }
        
        // Calculate cohort average & SD
        const mean = learnerScoresForKsb.reduce((a, b) => a + b, 0) / cohortSize;
        const variance = learnerScoresForKsb.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / cohortSize;
        const sd = Math.sqrt(variance);
        
        // Gap weight W = 10 - Mean
        const weight = 10 - mean;
        
        // Determine Priority Level
        let priority = "Medium";
        if (mean <= 3.0) priority = "High";
        else if (mean >= 8.0 && mean < 10.0) priority = "Low";
        else if (mean === 10.0) priority = "Exempt";

        // Assign primary theme (first reference theme)
        const primaryTheme = rowRefs[0].theme;
        const primaryDesc = rowRefs[0].rowDesc;

        ksbItems.push({
            code,
            mean,
            sd,
            weight,
            priority,
            theme: primaryTheme,
            desc: primaryDesc
        });
    });

    // 3. Sort KSB items logically by code type (K, S, B) and number for display
    ksbItems.sort((a, b) => {
        const typeA = a.code[0];
        const typeB = b.code[0];
        if (typeA !== typeB) {
            // Sort order: K, S, B
            const order = { 'K': 1, 'S': 2, 'B': 3 };
            return (order[typeA] || 4) - (order[typeB] || 4);
        }
        // Extract numeric part
        const numA = parseInt(a.code.substring(1)) || 0;
        const numB = parseInt(b.code.substring(1)) || 0;
        return numA - numB;
    });

    // 4. Proportional Guided Learning Hours (GLH) Distribution
    const totalWeight = ksbItems.reduce((sum, item) => sum + item.weight, 0);
    
    ksbItems.forEach(item => {
        // Proportional percentage
        item.pct = totalWeight > 0 ? (item.weight / totalWeight) * 100 : 0;
        // Proportional hours
        item.allocatedHours = Math.round((item.pct / 100) * totalGLH);
    });

    // 5. Aggregate hours and percentages at the Theme level (Weighting_Table / Table 1)
    const uniqueThemes = [...new Set(ksbItems.map(item => item.theme))];
    themeData = uniqueThemes.map(themeName => {
        const themeKsbItems = ksbItems.filter(item => item.theme === themeName);
        const allocatedHours = themeKsbItems.reduce((sum, item) => sum + item.allocatedHours, 0);
        const allocatedPct = totalGLH > 0 ? (allocatedHours / totalGLH) * 100 : 0;
        
        return {
            Theme_Name: themeName,
            Allocated_Pct: allocatedPct.toFixed(1) + "%",
            Allocated_Hours: String(allocatedHours)
        };
    });

    // 6. Sequencing PoS Calendar Modules (Table 2)
    generatePoSCalendar();

    // 7. Calculate RPL Funding reductions
    calculateRPLFunding(rows, fundingBand);

    // 8. Render visual elements (Stats, Charts, Tables, Payloads)
    updateStatsCards();
    renderCharts();
    renderTables();
    generateExportPayloads(fundingBand);
    
    // Set UI active state
    document.getElementById('status-text').textContent = "Analysis Complete";
    document.getElementById('status-text').previousElementSibling.className = "status-dot green";
}

// Generate the progressive curriculum study schedule
function generatePoSCalendar() {
    // Separate KSB items into type-based buckets
    const kItems = ksbItems.filter(item => item.code.startsWith('K'));
    const sItems = ksbItems.filter(item => item.code.startsWith('S'));
    const bItems = ksbItems.filter(item => item.code.startsWith('B'));

    // Sort buckets by priority/weight descending (widest gaps first, representing maximum instructional needs)
    kItems.sort((a, b) => b.weight - a.weight);
    sItems.sort((a, b) => b.weight - a.weight);
    bItems.sort((a, b) => b.weight - a.weight);

    // Define 6 Modules based on Timeline length
    // Months timeline ranges
    const stepMonths = durationMonths / 6;
    const timelineLabels = [];
    for (let i = 0; i < 6; i++) {
        const start = Math.round(i * stepMonths * 4) + 1; // approximate weeks
        const end = Math.round((i + 1) * stepMonths * 4);
        const startMonth = Math.floor(i * stepMonths) + 1;
        const endMonth = Math.floor((i + 1) * stepMonths);
        
        let label = `Month ${startMonth}-${endMonth} (Weeks ${start}-${end})`;
        if (startMonth === endMonth) {
            label = `Month ${startMonth} (Weeks ${start}-${end})`;
        }
        timelineLabels.push(label);
    }

    // Sequence KSBs dynamically:
    // Module 1 (Month 1-2): Foundational Knowledge (Frontloaded K items)
    // Module 2 (Month 3-4): Core Theories and Early Skills Application
    // Module 3 (Month 5-6): Progressive Skills Development
    // Module 4 (Month 7-8): Intermediate Competencies and Behaviours integration
    // Module 5 (Month 9-10): Advanced Activity Operations
    // Module 6 (Month 11-12): Integration, Workplace Verification & EPA Review

    // Distribute K, S, B across modules
    // Knowledge items: Modules 1 & 2 (80%), remaining 20% in Modules 3 & 4.
    // Skills items: Phase in progressively starting Module 2 (20%), Module 3 (30%), Module 4 (30%), Module 5 (20%).
    // Behaviours items: Phase in progressively starting Module 3 (30%), Module 4 (30%), Module 5 (25%), Module 6 (15%).

    const modulesMapping = [
        { title: "Foundational Standards & Basic Principles", ksbs: [], mode: "Day Release (On-Site FE College)", target: "Work Product / Test Paper" },
        { title: "Core Operational Concepts & Planning", ksbs: [], mode: "Day Release (On-Site FE College)", target: "Short Written Assignment" },
        { title: "Skills Activation & Practical Delivery", ksbs: [], mode: "Workplace Coaching & Observation", target: "Practical Observation / Witness Testimony" },
        { title: "Intermediate Application & Risk Mitigation", ksbs: [], mode: "Workplace Coaching & Seminars", target: "Reflective Journal / Work Logs" },
        { title: "Advanced Operations & Inclusion Practices", ksbs: [], mode: "Workplace Coaching & Mentorship", target: "Professional Discussion / Presentation" },
        { title: "Portfolio Consolidation & EPA Readiness", ksbs: [], mode: "Directed Self-Study & Review", target: "Full Portfolio Sign-off / Mock EPA" }
    ];

    // Distribute Knowledge items
    kItems.forEach((item, idx) => {
        if (idx < kItems.length * 0.5) {
            modulesMapping[0].ksbs.push(item.code);
        } else if (idx < kItems.length * 0.8) {
            modulesMapping[1].ksbs.push(item.code);
        } else if (idx < kItems.length * 0.95) {
            modulesMapping[2].ksbs.push(item.code);
        } else {
            modulesMapping[3].ksbs.push(item.code);
        }
    });

    // Distribute Skills items
    sItems.forEach((item, idx) => {
        if (idx < sItems.length * 0.2) {
            modulesMapping[1].ksbs.push(item.code);
        } else if (idx < sItems.length * 0.5) {
            modulesMapping[2].ksbs.push(item.code);
        } else if (idx < sItems.length * 0.8) {
            modulesMapping[3].ksbs.push(item.code);
        } else {
            modulesMapping[4].ksbs.push(item.code);
        }
    });

    // Distribute Behaviours items
    bItems.forEach((item, idx) => {
        if (idx < bItems.length * 0.3) {
            modulesMapping[2].ksbs.push(item.code);
        } else if (idx < bItems.length * 0.6) {
            modulesMapping[3].ksbs.push(item.code);
        } else if (idx < bItems.length * 0.85) {
            modulesMapping[4].ksbs.push(item.code);
        } else {
            modulesMapping[5].ksbs.push(item.code);
        }
    });

    // Construct PoS Calendar rows
    posCalendar = modulesMapping.map((m, idx) => {
        // Sort mapped KSBs for display
        m.ksbs.sort((a, b) => {
            const typeA = a[0], typeB = b[0];
            if (typeA !== typeB) return { 'K': 1, 'S': 2, 'B': 3 }[typeA] - { 'K': 1, 'S': 2, 'B': 3 }[typeB];
            return (parseInt(a.substring(1)) || 0) - (parseInt(b.substring(1)) || 0);
        });

        return {
            Timeline: timelineLabels[idx],
            Module_Title: m.title,
            Mapped_KSBs: m.ksbs.join(', '),
            Delivery_Mode: m.mode,
            OneFile_Target: m.target
        };
    });
}

// Calculate RPL funding deductions and learner exemptions count
function calculateRPLFunding(rows, fundingBand) {
    const ksbCount = rows.length;
    const hoursPerKsb = totalGLH / ksbCount;
    
    rplLog = [];

    // Parse files or simulation to count exemptions (score exactly 10)
    for (let l = 0; l < cohortSize; l++) {
        const exemptRowIndices = [];
        const exemptKsbCodes = [];
        
        cohortScores[l].forEach((score, rIdx) => {
            if (score === 10) {
                exemptRowIndices.push(rIdx);
                const rowKsb = rows[rIdx].ksb;
                // Add all individual KSB codes for this row
                rowKsb.replace(/,/g, ' ').split(/\s+/).filter(Boolean).forEach(c => {
                    exemptKsbCodes.push(c.trim().toUpperCase());
                });
            }
        });

        const exemptionsCount = exemptRowIndices.length;
        const hoursReduced = Math.round(exemptionsCount * hoursPerKsb);
        
        // Deduction formula: (hoursReduced / totalGLH) * fundingBand
        // We only deduct 50% of this value as per the template rule
        const potentialDeduction = (hoursReduced / totalGLH) * fundingBand;
        const netDeduction = Math.round(0.5 * potentialDeduction);

        let status = "Standard";
        if (exemptionsCount > 0) {
            status = "RPL Funding Reduction Applied";
        }

        rplLog.push({
            learnerName: `Learner ${l + 1}`,
            exemptionsCount,
            exemptKsbCodes: [...new Set(exemptKsbCodes)].join(', '),
            hoursReduced,
            netDeduction,
            status
        });
    }
}

// Update Top Stat Cards on Dashboard
function updateStatsCards() {
    document.getElementById('stat-cohort-size').textContent = cohortSize;
    document.getElementById('stat-ksb-count').textContent = ksbItems.length;

    // Get count of K, S, B
    const kCount = ksbItems.filter(item => item.code.startsWith('K')).length;
    const sCount = ksbItems.filter(item => item.code.startsWith('S')).length;
    const bCount = ksbItems.filter(item => item.code.startsWith('B')).length;
    document.getElementById('stat-ksb-ratio').textContent = `${kCount} Knowledge • ${sCount} Skills • ${bCount} Behaviours`;

    // Filter Top Gaps (Mean <= 4.0)
    const highGaps = ksbItems.filter(item => item.mean <= 4.0)
                             .map(item => item.code);
    const topGapsText = highGaps.length > 0 ? highGaps.slice(0, 5).join(', ') + (highGaps.length > 5 ? '...' : '') : "None (High Baseline)";
    document.getElementById('stat-top-gaps').textContent = topGapsText;

    // Aggregate RPL
    const totalRplReduction = rplLog.reduce((sum, item) => sum + item.netDeduction, 0);
    const totalRplHours = rplLog.reduce((sum, item) => sum + item.hoursReduced, 0);
    const maxFunding = fundingBandValue();
    const pctReduction = maxFunding > 0 ? ((totalRplReduction / (cohortSize * maxFunding)) * 100).toFixed(1) : "0";

    document.getElementById('stat-rpl-reduction').textContent = `£${totalRplReduction.toLocaleString()}`;
    document.getElementById('stat-rpl-subtext').textContent = `${totalRplHours.toLocaleString()} hrs reduced total (${pctReduction}% cohort reduction)`;

    // Hydrate RPL summary boxes
    document.getElementById('rpl-total-value').textContent = `£${(cohortSize * maxFunding).toLocaleString()}`;
    document.getElementById('rpl-exemptions-count').textContent = rplLog.reduce((sum, item) => sum + item.exemptionsCount, 0);
    document.getElementById('rpl-hours-reduced').textContent = `${totalRplHours.toLocaleString()} hrs`;
    document.getElementById('rpl-adjusted-funding').textContent = `£${((cohortSize * maxFunding) - totalRplReduction).toLocaleString()}`;
}

// Get the funding band value of the active standard
function fundingBandValue() {
    const template = FALLBACK_TEMPLATES[currentStandard];
    return template ? template.fundingBand : 14000;
}

// Render Dashboard Charts
function renderCharts() {
    // Core styling based on theme
    const isDark = document.body.classList.contains('dark-theme');
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    const textColor = isDark ? '#94a3b8' : '#475569';
    
    // Destroy previous chart instances if they exist
    if (gapChartInstance) gapChartInstance.destroy();
    if (themeChartInstance) themeChartInstance.destroy();

    // Chart 1: KSB Gap Bar Chart
    const ctxGap = document.getElementById('gap-chart').getContext('2d');
    const codes = ksbItems.map(item => item.code);
    const means = ksbItems.map(item => item.mean.toFixed(1));
    const colors = ksbItems.map(item => {
        if (item.priority === 'High') return 'rgba(239, 68, 68, 0.75)'; // red
        if (item.priority === 'Medium') return 'rgba(245, 158, 11, 0.75)'; // amber
        if (item.priority === 'Low') return 'rgba(14, 165, 233, 0.75)'; // blue
        return 'rgba(16, 185, 129, 0.75)'; // green (exempt)
    });

    gapChartInstance = new Chart(ctxGap, {
        type: 'bar',
        data: {
            labels: codes,
            datasets: [{
                label: 'Mean Competency Score',
                data: means,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.75', '1')),
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 10,
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: textColor }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Chart 2: Theme Hours Proportional Doughnut Chart
    const ctxTheme = document.getElementById('theme-chart').getContext('2d');
    const themeNames = themeData.map(item => item.Theme_Name);
    const themePct = themeData.map(item => parseFloat(item.Allocated_Pct));
    
    const themeColors = [
        'rgba(99, 102, 241, 0.75)',  // indigo
        'rgba(139, 92, 246, 0.75)',  // violet
        'rgba(16, 185, 129, 0.75)',  // emerald
        'rgba(245, 158, 11, 0.75)'   // amber
    ];

    themeChartInstance = new Chart(ctxTheme, {
        type: 'doughnut',
        data: {
            labels: themeNames,
            datasets: [{
                data: themePct,
                backgroundColor: themeColors.slice(0, themeNames.length),
                borderColor: isDark ? '#0f172a' : '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: textColor, padding: 16 }
                }
            },
            cutout: '60%'
        }
    });
}

// Populate Dashboard Tables
function renderTables() {
    // Table 1: Weightings Table
    const weightingBody = document.querySelector('#theme-weighting-table tbody');
    weightingBody.innerHTML = '';
    
    themeData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600;">${row.Theme_Name}</td>
            <td>${row.Allocated_Pct}</td>
            <td><strong>${row.Allocated_Hours} hrs</strong></td>
        `;
        weightingBody.appendChild(tr);
    });

    // Table 2: PoS Calendar Table
    const calendarBody = document.querySelector('#pos-calendar-table tbody');
    calendarBody.innerHTML = '';
    
    posCalendar.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600; white-space: nowrap; color: var(--color-secondary);">${row.Timeline}</td>
            <td style="font-weight: 500;">${row.Module_Title}</td>
            <td style="font-family: monospace; font-size: 0.8125rem; color: var(--color-accent);">${row.Mapped_KSBs}</td>
            <td><span class="delivery-pill">${row.Delivery_Mode}</span></td>
            <td><span class="evidence-pill">${row.OneFile_Target}</span></td>
        `;
        calendarBody.appendChild(tr);
    });

    // Table 3: Ingested KSB Scores details
    filterKSBTable();

    // Table 4: RPL reduction details log
    const rplBody = document.querySelector('#rpl-log-table tbody');
    rplBody.innerHTML = '';
    
    rplLog.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600;">${row.learnerName}</td>
            <td style="font-family: monospace; font-size: 0.8125rem;">${row.exemptKsbCodes || 'None'}</td>
            <td>${row.exemptionsCount} KSBs</td>
            <td>${row.hoursReduced} hrs</td>
            <td style="color: var(--color-green); font-weight: 600;">-£${row.netDeduction.toLocaleString()}</td>
            <td><span class="priority-badge ${row.exemptionsCount > 0 ? 'exempt' : 'low'}">${row.status}</span></td>
        `;
        rplBody.appendChild(tr);
    });
}

// Filter and hydrate KSB Scores Table
function filterKSBTable() {
    const searchVal = document.getElementById('ksb-search').value.toLowerCase();
    const priorityVal = document.getElementById('priority-filter').value;
    const body = document.querySelector('#ksb-scores-table tbody');
    body.innerHTML = '';
    
    const filteredItems = ksbItems.filter(item => {
        const matchSearch = item.code.toLowerCase().includes(searchVal) || item.desc.toLowerCase().includes(searchVal) || item.theme.toLowerCase().includes(searchVal);
        const matchPriority = priorityVal === 'all' || item.priority.toLowerCase() === priorityVal;
        return matchSearch && matchPriority;
    });

    filteredItems.forEach(item => {
        const tr = document.createElement('tr');
        
        let priorityClass = 'medium';
        if (item.priority === 'High') priorityClass = 'high';
        if (item.priority === 'Low') priorityClass = 'low';
        if (item.priority === 'Exempt') priorityClass = 'exempt';

        tr.innerHTML = `
            <td style="font-weight: 700; color: var(--color-primary);">${item.code}</td>
            <td style="font-size: 0.8125rem; color: var(--text-muted);">${item.theme}</td>
            <td style="font-size: 0.8125rem; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.desc}">${item.desc}</td>
            <td><strong>${item.mean.toFixed(1)}</strong></td>
            <td>${item.sd.toFixed(2)}</td>
            <td>${item.weight.toFixed(1)}</td>
            <td><span class="priority-badge ${priorityClass}">${item.priority}</span></td>
            <td><strong>${item.allocatedHours} hrs</strong></td>
        `;
        body.appendChild(tr);
    });
}

// Generate MS Dynamics Integration and Word Template Hydration JSON Payloads
function generateExportPayloads(fundingBand = 14000) {
    // 1. MS Dynamics / OneFile integration payload
    const activeTemplate = FALLBACK_TEMPLATES[currentStandard];
    const stdName = activeTemplate ? activeTemplate.standardName : "Custom App Standard";
    
    // Aggregate Top Gaps KSBs
    const highGaps = ksbItems.filter(item => item.mean <= 3.0).map(item => item.code);
    const topGapsStr = highGaps.join(', ');
    
    // Construct RPL narrative notes
    const exemptCounts = rplLog.filter(item => item.exemptionsCount > 0).length;
    const totalRplHours = rplLog.reduce((sum, item) => sum + item.hoursReduced, 0);
    const totalRplReduction = rplLog.reduce((sum, item) => sum + item.netDeduction, 0);
    
    let rplNarrative = "No baseline exemptions scored at 10; full core guided learning hour delivery recommended.";
    if (exemptCounts > 0) {
        const avgHours = Math.round(totalRplHours / cohortSize);
        rplNarrative = `${exemptCounts} of ${cohortSize} learners met full baseline competency (score 10) in specific KSB fields; average hours reduction of ${avgHours} hrs per learner applied, leading to £${totalRplReduction.toLocaleString()} standard funding reduction.`;
    }

    const dynamicsPayload = {
        cohort_metadata: {
            standard_name: stdName,
            cohort_count: cohortSize,
            total_glh: totalGLH,
            duration_months: durationMonths,
            total_standard_funding: cohortSize * fundingBand,
            net_adjusted_funding: (cohortSize * fundingBand) - totalRplReduction
        },
        ksb_gap_weights: ksbItems.map(item => ({
            code: item.code,
            mean_score: parseFloat(item.mean.toFixed(2)),
            sd_score: parseFloat(item.sd.toFixed(2)),
            gap_weight: parseFloat(item.weight.toFixed(2)),
            priority: item.priority,
            allocated_hours: item.allocatedHours
        })),
        theme_weightings: themeData,
        programme_modules: posCalendar.map((mod, idx) => ({
            module_id: idx + 1,
            timeline: mod.Timeline,
            title: mod.Module_Title,
            delivery_mode: mod.Delivery_Mode,
            onefile_target: mod.OneFile_Target,
            mapped_ksbs: mod.Mapped_KSBs.split(', '),
            total_module_hours: mod.Mapped_KSBs.split(', ').reduce((sum, code) => {
                const ksb = ksbItems.find(k => k.code === code.trim());
                return sum + (ksb ? ksb.allocatedHours : 0);
            }, 0)
        }))
    };

    // 2. Microsoft Word Template Hydration Payload (.docx Content Controls / Mail-Merge)
    const wordPayload = {
        template_data: {
            Standard_Name: stdName,
            Cohort_Count: cohortSize,
            Top_Gaps: topGapsStr || "None",
            RPL_Notes: rplNarrative,
            Weighting_Table: themeData,
            PoS_Calendar_Table: posCalendar
        }
    };

    // Output payload textboxes
    document.getElementById('dynamics-payload-code').textContent = JSON.stringify(dynamicsPayload, null, 2);
    document.getElementById('word-payload-code').textContent = JSON.stringify(wordPayload, null, 2);
}

// Copy Code Area helper
function copyToClipboard(elementId) {
    const codeEl = document.getElementById(elementId);
    const range = document.createRange();
    range.selectNode(codeEl);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    try {
        document.execCommand('copy');
        showToast("Copied JSON payload to clipboard!");
    } catch (err) {
        showToast("Failed to copy!");
    }
    window.getSelection().removeAllRanges();
}

// Download JSON file helper
function downloadJSON(elementId, filename) {
    const codeText = document.getElementById(elementId).textContent;
    const blob = new Blob([codeText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Toast indicator
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2500);
}
