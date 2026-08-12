// Zero-Key Free Public AI Gateway for Smart Objectives & Sequence Generator
async function callPublicAI(promptText) {
    const response = await fetch("https://text.pollinations.ai/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: [
                { role: "system", content: "You are a master fire service instructor in Red Deer County, Alberta. Write concise, professional, operationally accurate fire training content." },
                { role: "user", content: promptText }
            ],
            model: "openai",
            json: false
        })
    });
    
    if (!response.ok) throw new Error("Public AI gateway failed.");
    return await response.text();
}

async function generateSmartObjectives() {
    const title = document.getElementById('input-title').value || "Training Drill";
    const catSelect = document.getElementById('input-category');
    const categoryName = catSelect ? catSelect.options[catSelect.selectedIndex].text : "Fire Operations";
    const objField = document.getElementById('input-objectives');
    const outObj = document.getElementById('output-objectives');

    const selectedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input:checked').forEach(cb => {
        selectedSkills.push(cb.value);
    });

    let currentInput = objField.value.trim();
    objField.value = "AI is generating custom SMART objectives...";

    const prompt = `Write 3 to 4 professional SMART training objectives for a fire department drill.
- Title: ${title}
- Category: ${categoryName}
- Selected Skills: ${selectedSkills.join(', ') || 'General operations'}
- Instructor Notes/Focus: ${currentInput || 'Standard operational drill'}

Output ONLY a clean, numbered list of 3 to 4 professional objectives. No markdown headers.`;

    try {
        const aiText = await callPublicAI(prompt);
        objField.value = aiText.trim();
        if (outObj) outObj.textContent = aiText.trim();
    } catch (error) {
        console.error(error);
        objField.value = "1. Successfully execute training drill safely.\n2. Complete all operational skills.\n3. Maintain crew accountability.";
        if (outObj) outObj.textContent = objField.value;
    }
}

async function generateSequence() {
    const title = document.getElementById('input-title').value || "Training Drill";
    const catSelect = document.getElementById('input-category');
    const categoryName = catSelect ? catSelect.options[catSelect.selectedIndex].text : "Fire Operations";
    const seqField = document.getElementById('input-sequence');
    const outSeq = document.getElementById('output-sequence');

    const selectedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input:checked').forEach(cb => {
        selectedSkills.push(cb.value);
    });

    let currentInput = seqField.value.trim();
    seqField.value = "AI is designing your training sequence...";

    const prompt = `Create a professional, step-by-step training sequence (numbered 1 to 4) for a fire drill.
- Title: ${title}
- Category: ${categoryName}
- Selected Skills: ${selectedSkills.join(', ') || 'Standard drill'}
- Context/Notes: ${currentInput || 'Standard operational progression'}

Incorporate local standards like Alberta OHS if relevant. Output ONLY the numbered steps clearly.`;

    try {
        const aiText = await callPublicAI(prompt);
        seqField.value = aiText.trim();
        if (outSeq) outSeq.textContent = aiText.trim();
    } catch (error) {
        console.error(error);
        seqField.value = "1. Briefing and safety check.\n2. Apparatus setup.\n3. Practical rotations.\n4. Hot wash and debrief.";
        if (outSeq) outSeq.textContent = objField.value;
    }
}

// --- CATEGORIES, SKILLS DATA & INITIALIZATION LOGIC ---
const trainingCategories = {
    traffic_management: {
        name: "Traffic Management & Apparatus Positioning",
        skills: [
            "Alberta OHS Highway Safety Compliance",
            "Apparatus Fend-Off Positioning (45-degree angle)",
            "Cone & Taper Deployment (1 pylon per 10 km/h rule)",
            "Single-Lane Alternating Traffic Control",
            "Flare Placement & Nighttime Visibility Setup"
        ],
        equipment: [
            "Pylons / Traffic Cones (Minimum 10)",
            "High-Visibility ANSI Class 3 Vests",
            "Flares / Emergency LED Road Flares",
            "Pumper / Rescue Apparatus with Chevron Striping",
            "Handheld Traffic Wands / Stop-Slow Paddles"
        ]
    },
    pump_operations: {
        name: "Pump Operations & Water Supply",
        skills: [
            "Drafting Water from Static Sources",
            "Relay Pumping Setup & Pressure Calculations",
            "Hydrant Connection & Gate Valve Operation",
            "Troubleshooting Cavitation & Pressure Fluctuations",
            "Master Stream Appliance Deployment"
        ],
        equipment: [
            "Engine / Pumper Apparatus",
            "Hard Suction Hoses & Strainers",
            "5-inch Supply Hose & LDH Clamps",
            "Pitot Gauge & Flow Testing Kit",
            "Gate Valves & Double Male/Female Adapters"
        ]
    },
    structural_search: {
        name: "Structural Search & Rescue",
        skills: [
            "Primary & Secondary Search Techniques",
            "Orientation & Search Rope Management",
            "Victim Removal & Drag/Carry Methods",
            "Thermal Imaging Camera (TIC) Scanning",
            "Rapid Intervention Crew (RIC) Standby Procedures"
        ],
        equipment: [
            "Self-Contained Breathing Apparatus (SCBA)",
            "Thermal Imaging Camera (TIC)",
            "Search Ropes & Webbing Straps",
            "Forcible Entry Irons (Halligan & Axe)",
            "Handheld Radio / Communication Gear"
        ]
    },
    hose_advancement: {
        name: "Hose Advancement & Fire Attack",
        skills: [
            "Line Deployment from Pumper Bed",
            "Corner & Stairwell Maneuvering",
            "Nozzle Technique & Pattern Manipulation",
            "Breeching & Vent-Enter-Isolate-Search (VEIS) Coordination",
            "Rapid Water Shutdown & Extinguishing Adjustments"
        ],
        equipment: [
            "1-3/4 inch and 2-1/2 inch Attack Lines",
            "Combination / Smooth Bore Nozzles",
            "Hose Straps and Hoisting Slings",
            "Full Structural Turnout Gear & SCBA",
            "Forcible Entry Tools"
        ]
    },
    auto_extrication: {
        name: "Automotive Extrication & Stabilization",
        skills: [
            "Vehicle Hazard Control & 12V/HV Disconnection",
            "Step Chocks & Strut Stabilization System Setup",
            "Glass Management & Patient Protection",
            "Spreader, Cutter, and Ram Operation",
            "B-Post Pull & Dash Roll Maneuvers"
        ],
        equipment: [
            "Hydraulic Rescue Tools (Jaws of Life)",
            "Cribbing Blocks & Step Chocks",
            "Res-Q-Jack or Multi-Struts",
            "Glass Master & Protection Tarps",
            "Reciprocating Saw & Air Chisel"
        ]
    }
};

function updateCategoryDetails(selectedKey) {
    const skillsContainer = document.getElementById('skills-checkbox-container');
    const equipContainer = document.getElementById('equipment-checkbox-container');
    
    if (!skillsContainer || !equipContainer) return;

    skillsContainer.innerHTML = '';
    equipContainer.innerHTML = '';

    if (trainingCategories[selectedKey]) {
        const data = trainingCategories[selectedKey];

        // Populate Skills Checkboxes
        data.skills.forEach((skill) => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '4px';
            label.innerHTML = `<input type="checkbox" value="${skill}" checked> ${skill}`;
            skillsContainer.appendChild(label);
        });

        // Populate Equipment Checkboxes
        data.equipment.forEach((eq) => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '4px';
            label.innerHTML = `<input type="checkbox" value="${eq}" checked> ${eq}`;
            equipContainer.appendChild(label);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('input-category');
    if (!categorySelect) return;

    // Populate Category Dropdown
    for (const [key, cat] of Object.entries(trainingCategories)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    }

    // Trigger initial load for the default selected category
    if (categorySelect.value && trainingCategories[categorySelect.value]) {
        updateCategoryDetails(categorySelect.value);
    }

    categorySelect.addEventListener('change', (e) => {
        updateCategoryDetails(e.target.value);
    });

    // Real-time live preview text bindings
    const bindLivePreview = (inputId, outputId) => {
        const input = document.getElementById(inputId);
        const output = document.getElementById(outputId);
        if (input && output) {
            input.addEventListener('input', () => {
                output.textContent = input.value || '--';
            });
        }
    };

    bindLivePreview('input-title', 'output-title');
    bindLivePreview('input-date', 'output-date');
    bindLivePreview('input-objectives', 'output-objectives');
    bindLivePreview('input-sequence', 'output-sequence');
    bindLivePreview('input-station1', 'output-station1');
    bindLivePreview('input-station2', 'output-station2');
    bindLivePreview('input-station3', 'output-station3');
    bindLivePreview('input-safety', 'output-safety');
    bindLivePreview('input-notes', 'output-notes');
});
