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

// True Context-Aware Objective Assist
function generateSmartObjectives() {
    const catKey = document.getElementById('input-category').value;
    const title = document.getElementById('input-title').value || "Training Drill";
    const objField = document.getElementById('input-objectives');
    const outObj = document.getElementById('output-objectives');

    // Gather checked skills
    const selectedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input:checked').forEach(cb => {
        selectedSkills.push(cb.value.split(' ')[0]); // Grabs key skill terms
    });

    let currentInput = objField.value.trim();
    let generatedText = "";

    if (currentInput) {
        // If the user typed something, use it as the operational focus and wrap it into SMART format
        generatedText = `• Specific: Successfully execute ${title} focusing on ${currentInput}.\n` +
                        `• Measurable: Complete all selected practical skill components (${selectedSkills.slice(0,2).join(', ') || 'core tasks'}) without critical safety deviation.\n` +
                        `• Achievable: Utilizing standard department apparatus, PPE, and approved SOG guidelines.\n` +
                        `• Relevant: Enhances company-level operational readiness and NFPA/Alberta competency.\n` +
                        `• Time-Bound: Evaluated during the practical training block.`;
    } else {
        // Fallback context based on category if nothing was typed yet
        if (catKey === "traffic_management") {
            generatedText = `• Specific: Establish safe roadway positive blocking and cone taper for ${title}.\n` +
                            `• Measurable: Crew deploys taper meeting the 1 pylon per 10 km/h rule safely.\n` +
                            `• Achievable: Utilizing standard pylon kits and apparatus placement.\n` +
                            `• Relevant: Mitigates secondary strike hazards during roadway operations.\n` +
                            `• Time-Bound: Completed within the training rotation window.`;
        } else {
            generatedText = `• Specific: Successfully complete operational objectives for ${title}.\n` +
                            `• Measurable: Demonstrate proper proficiency in ${selectedSkills.join(', ') || 'assigned tasks'}.\n` +
                            `• Achievable: Utilizing department apparatus, PPE, and standard tools.\n` +
                            `• Relevant: Maintains company-level operational readiness.\n` +
                            `• Time-Bound: Executed within the scheduled training session.`;
        }
    }

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
