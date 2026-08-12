let standardsData = {};

fetch('standards.json')
    .then(res => res.json())
    .then(data => {
        standardsData = data;
        const select = document.getElementById('input-category');
        for (let key in data) {
            let opt = document.createElement('option');
            opt.value = key;
            opt.textContent = data[key].categoryName;
            select.appendChild(opt);
        }
    });

const basicFields = ['title', 'date', 'sequence', 'station1', 'station2', 'station3', 'safety', 'notes', 'objectives'];
basicFields.forEach(field => {
    const inputEl = document.getElementById(`input-${field}`);
    const outputEl = document.getElementById(`output-${field}`);
    if(inputEl && outputEl) {
        inputEl.addEventListener('input', () => {
            outputEl.textContent = inputEl.value;
        });
    }
});

function loadCategoryData() {
    const catKey = document.getElementById('input-category').value;
    const skillsContainer = document.getElementById('skills-checkbox-container');
    const resContainer = document.getElementById('resources-checkbox-container');
    
    skillsContainer.innerHTML = '';
    resContainer.innerHTML = '';

    if (!standardsData[catKey]) return;

    const category = standardsData[catKey];

    category.skills.forEach(skill => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `<label><input type="checkbox" value="${skill.name} (${skill.standard})" onchange="updateSelections()"> <strong>${skill.name}</strong> <em>(${skill.standard})</em></label>`;
        skillsContainer.appendChild(div);
    });

    category.resources.forEach(res => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `<label><input type="checkbox" value="${res}" onchange="updateSelections()"> ${res}</label>`;
        resContainer.appendChild(div);
    });

    if (category.defaultSafety) {
        document.getElementById('input-safety').value = category.defaultSafety;
        document.getElementById('output-safety').textContent = category.defaultSafety;
    }
}

// True Context-Aware Natural SMART Objectives Generator
function generateSmartObjectives() {
    const title = document.getElementById('input-title').value || "Training Drill";
    const objField = document.getElementById('input-objectives');
    const outObj = document.getElementById('output-objectives');

    // Gather checked skills
    const selectedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input:checked').forEach(cb => {
        // Extracts clean skill names without standard codes
        let skillName = cb.value.split('(')[0].trim();
        selectedSkills.push(skillName);
    });

    let currentInput = objField.value.trim();
    let objectives = [];

    // Objective 1: Operational Focus (Specific & Achievable)
    if (currentInput) {
        objectives.push(`1. Successfully execute ${title} by focusing on ${currentInput} using standard department apparatus and full personal protective equipment.`);
    } else {
        objectives.push(`1. Successfully execute ${title} through structured practical application and adherence to approved department SOG guidelines.`);
    }

    // Objective 2: Core Skill Proficiency (Measurable)
    if (selectedSkills.length > 0) {
        let skillsText = selectedSkills.slice(0, 3).join(', ');
        objectives.push(`2. Demonstrate accurate proficiency in core operational components, specifically ${skillsText}, ensuring zero critical safety deviations.`);
    } else {
        objectives.push(`2. Demonstrate complete technical proficiency in all assigned hands-on evolutions without compromising safety parameters.`);
    }

    // Objective 3: Scene Safety & Communication (Relevant)
    objectives.push(`3. Maintain active hazard awareness, clear radio/verbal communication, and strict crew accountability throughout the entire training evolution.`);

    // Objective 4: Time-Bound Evaluation (Time-Bound)
    objectives.push(`4. Complete all practical station rotations, tactical debriefs, and site restoration within the scheduled shift training window.`);

    let generatedText = objectives.join('\n');
    objField.value = generatedText;
    outObj.textContent = generatedText;
}

// True Context-Aware Training Sequence Assist
function generateSequence() {
    const catKey = document.getElementById('input-category').value;
    const seqField = document.getElementById('input-sequence');
    const outSeq = document.getElementById('output-sequence');

    // Gather checked skills
    const selectedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input:checked').forEach(cb => {
        selectedSkills.push(cb.value.split(' ')[0]); // Grabs key skill terms
    });

    let currentInput = seqField.value.trim();
    let generatedText = "";

    if (currentInput) {
        // If the user typed notes, format and structure them into a professional progression
        generatedText = `1. Initial briefing and safety walkthrough focusing on: ${currentInput}.\n` +
                        `2. Apparatus setup, equipment staging, and personal protective equipment (PPE) compliance check.\n` +
                        `3. Practical skill execution emphasizing ${selectedSkills.slice(0, 3).join(', ') || 'core evolutions'}.\n` +
                        `4. Final hot wash, tactical debrief, equipment recovery, and site restoration.`;
    } else {
        // Category-tailored dynamic sequences if nothing was typed yet
        if (catKey === "traffic_management") {
            generatedText = `1. Classroom briefing, hazard identification, and Alberta OHS traffic safety review.\n` +
                            `2. Tender/Engine positioning (45-degree fend-off) and cone taper deployment (1 pylon per 10 km/h rule).\n` +
                            `3. Practical station rotation: single-lane alternating control, flare placement, and lookout coordination.\n` +
                            `4. Tactical debrief, equipment recovery, site cleanup, and crew sign-off roster sign-off.`;
        } else {
            generatedText = `1. Classroom briefing, SOG review, and hazard identification.\n` +
                            `2. Apparatus positioning, tool inspection, and personal protective equipment (PPE) check.\n` +
                            `3. Hands-on practical station rotations and controlled skill execution (${selectedSkills.slice(0, 2).join(', ') || 'assigned tasks'}).\n` +
                            `4. Tactical debrief, equipment recovery, site cleanup, and instructor review.`;
        }
    }

    seqField.value = generatedText;
    outSeq.textContent = generatedText;
}
function updateSelections() {
    const selectedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input:checked').forEach(cb => {
        selectedSkills.push(`• ${cb.value}`);
    });
    document.getElementById('output-skills-list').textContent = selectedSkills.join('\n') || '--';

    const selectedRes = [];
    document.querySelectorAll('#resources-checkbox-container input:checked').forEach(cb => {
        selectedRes.push(`• ${cb.value}`);
    });
    document.getElementById('output-resources').textContent = selectedRes.join('\n') || '--';
}

function savePlan() {
    const data = {};
    basicFields.forEach(field => {
        data[field] = document.getElementById(`input-${field}`).value;
    });
    localStorage.setItem('fireTrainingPlan', JSON.stringify(data));
    alert('Saved!');
}

function loadPlan() {
    const saved = localStorage.getItem('fireTrainingPlan');
    if (saved) {
        const data = JSON.parse(saved);
        basicFields.forEach(field => {
            if (data[field]) {
                document.getElementById(`input-field`) // safe lookup
                document.getElementById(`input-${field}`).value = data[field];
                document.getElementById(`output-${field}`).textContent = data[field];
            }
        });
        alert('Loaded!');
    }
}

function exportPDF() {
    window.print();
}
