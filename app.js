// Live data binding from inputs to output sheet
const fields = ['title', 'date', 'objectives', 'skill', 'resources', 'sequence', 'station1', 'station2', 'station3', 'safety', 'notes'];

fields.forEach(field => {
    const inputEl = document.getElementById(`input-${field}`);
    const outputEl = document.getElementById(`output-${field}`);
    
    if(inputEl && outputEl) {
        inputEl.addEventListener('input', () => {
            outputEl.textContent = inputEl.value;
        });
    }
});

// Load standard / JPR data into dropdown
let standardsData = {};
fetch('standards.json')
    .then(res => res.json())
    .then(data => {
        standardsData = data;
        const select = document.getElementById('input-standards');
        for (let key in data) {
            let opt = document.createElement('option');
            opt.value = key;
            opt.textContent = data[key].name;
            select.appendChild(opt);
        }
    })
    .catch(err => console.log('Standards json loading info:', err));

function loadStandard() {
    const val = document.getElementById('input-standards').value;
    if (standardsData[val]) {
        document.getElementById('input-objectives').value = standardsData[val].objectives;
        document.getElementById('output-objectives').textContent = standardsData[val].objectives;
        
        document.getElementById('input-safety').value = standardsData[val].safety;
        document.getElementById('output-safety').textContent = standardsData[val].safety;
    }
}

// Local Storage Caching
function savePlan() {
    const data = {};
    fields.forEach(field => {
        data[field] = document.getElementById(`input-${field}`).value;
    });
    localStorage.setItem('fireTrainingPlan', JSON.stringify(data));
    alert('Lesson plan cached locally!');
}

function loadPlan() {
    const saved = localStorage.getItem('fireTrainingPlan');
    if (saved) {
        const data = JSON.parse(saved);
        fields.forEach(field => {
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

// PDF Export Trigger (Fixed for reliable rendering)
function exportPDF() {
    const element = document.getElementById('printable-area');
    
    const opt = {
        margin:       0.2,
        filename:     'Fire-Training-Lesson-Plan.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            logging: true,
            letterRendering: true 
        },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Trigger html2pdf with a small safety timeout to ensure DOM is fully painted
    setTimeout(() => {
        html2pdf().from(element).set(opt).save();
    }, 300);
}
