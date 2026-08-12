let standardsData = {};

// Fetch database on load
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
    })
    .catch(err => console.log('Error loading standards:', err));

// Live text binding for basic fields
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

// Handle Category Selection & Checkbox Generation
function loadCategoryData() {
    const catKey = document.getElementById('input-category').value;
    const skillsContainer = document.getElementById('skills-checkbox-container');
    const resContainer = document.getElementById('resources-checkbox-container');
    
    skillsContainer.innerHTML = '';
    resContainer.innerHTML = '';

    if (!standardsData[catKey]) return;

    const category = standardsData[catKey];

    // Populate Skills checkboxes
    category.skills.forEach((skill, index) => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `
            <label>
                <input type="checkbox" value="${skill.name} (${skill.standard})" onchange="updateSelections()"> 
                <strong>${skill.name}</strong> <span class="tag">(${skill.standard})</span>
            </label>
        `;
        skillsContainer.appendChild(div);
    });

    // Populate Resources checkboxes
    category.resources.forEach((res, index) => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `
            <label>
                <input type="checkbox" value="${res}" onchange="updateSelections()"> 
                ${res}
            </label>
        `;
        resContainer.appendChild(div);
    });

    // Auto-populate safety overview if available
    let autoSafety = category.skills.map(s => `• ${s.name}: ${s.description}`).join('\n');
    document.getElementById('input-safety').value = autoSafety;
    document.getElementById('output-safety').textContent = autoSafety;
}

// Compile checked items into the preview sheet
function updateSelections() {
    // Gather checked skills
    const selectedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input[type="checkbox"]:checked').forEach(cb => {
        selectedSkills.push(`• ${cb.value}`);
    });
    const skillsText = selectedSkills.join('\n');
    document.getElementById('output-skills-list').textContent = skillsText || '--';

    // Gather checked resources
    const selectedRes = [];
    document.querySelectorAll('#resources-checkbox-container input[type="checkbox"]:checked').forEach(cb => {
        selectedRes.push(`• ${cb.value}`);
    });
    const resText = selectedRes.join('\n');
    document.getElementById('input-resources-val') || '';
    document.getElementById('output-resources').textContent = resText || '--';
}

// Local Storage Caching
function savePlan() {
    const data = {};
    basicFields.forEach(field => {
        data[field] = document.getElementById(`input-${field}`).value;
    });
    localStorage.setItem('fireTrainingPlan', JSON.stringify(data));
    alert('Lesson plan cached locally!');
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
        alert('Loaded successfully from cache.');
    } else {
        alert('No saved plan found.');
    }
}

// PDF Export Trigger (Optimized for full top-to-bottom multi-page capture)
function exportPDF() {
    const element = document.getElementById('printable-area');
    
    const opt = {
        margin:       [0.3, 0.3, 0.3, 0.3],
        filename:     'Fire-Training-Lesson-Plan.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            letterRendering: true,
            windowWidth: element.scrollWidth 
        },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
    };

    setTimeout(() => {
        html2pdf().from(element).set(opt).save();
    }, 200);
}
