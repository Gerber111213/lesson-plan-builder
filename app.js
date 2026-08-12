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
                document.getElementById(`input-${field}`).value = data[field];
                document.getElementById(`output-${field}`).textContent = data[field];
            }
        });
        alert('Loaded!');
    }
}

function exportPDF() {
    const element = document.getElementById('printable-area');
    const opt = {
        margin:       0.3,
        filename:     'Training-Plan.pdf',
        image:        { type: 'jpeg', quality: 0.95 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
}
