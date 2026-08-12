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

// AI Assist: Generate SMART Objectives based on chosen category
function generateSmartObjectives() {
    const catKey = document.getElementById('input-category').value;
    const objField = document.getElementById('input-objectives');
    const outObj = document.getElementById('output-objectives');

    let text = "";
    if (catKey === "traffic_management") {
        text = "• Specific: Successfully establish a safe blocking corridor and cone taper.\n• Measurable: Crew sets cone taper within 3 minutes meeting provincial highway safety guidelines.\n• Achievable: Utilizing standard apparatus positioning and pylon kits.\n• Relevant: Mitigates secondary strike hazards during roadway operations.\n• Time-Bound: Evaluated during the 1-hour practical drill session.";
    } else if (catKey === "forcible_entry") {
        text = "• Specific: Demonstrate proper gapping, setting, and forcing technique on an inward-swinging prop.\n• Measurable: Successful door breach achieved in under 60 seconds without tool slip.\n• Achievable: Using standard halligan and axe ('The Irons').\n• Relevant: Essential for rapid interior access in structure fires.\n• Time-Bound: Completed during station rotations.";
    } else {
        text = "• Specific: Execute core operational maneuvers safely and efficiently.\n• Measurable: Complete all practical steps without critical safety infractions.\n• Achievable: Utilizing department apparatus, PPE, and standard tools.\n• Relevant: Maintains company-level operational readiness and NFPA competency.\n• Time-Bound: Executed within the allocated training block.";
    }

    objField.value = text;
    outObj.textContent = text;
}

// AI Assist: Generate Structured Training Sequence (No Times)
function generateSequence() {
    const seqField = document.getElementById('input-sequence');
    const outSeq = document.getElementById('output-sequence');

    let text = "1. Classroom briefing, hazard identification, and safety protocol review.\n2. Apparatus positioning, tool inspection, and personal protective equipment (PPE) check.\n3. Hands-on practical station rotations and controlled traffic safety skill execution.\n4. Tactical debrief, equipment recovery, site cleanup, and instructor review.";

    seqField.value = text;
    outSeq.textContent = text;
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
