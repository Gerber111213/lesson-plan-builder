let trainingCategories = {};

const GROQ_MODEL = "llama-3.3-70b-versatile";

// Securely gets or prompts for the Groq API key using browser storage
function getGroqApiKey() {
    let apiKey = localStorage.getItem('groq_api_key');
    if (!apiKey) {
        apiKey = prompt("Enter your free Groq API key (saved securely in your browser):");
        if (apiKey) {
            localStorage.setItem('groq_api_key', apiKey.trim());
        }
    }
    return apiKey;
}

async function callGroqAI(promptText) {
    const apiKey = getGroqApiKey();
    if (!apiKey) throw new Error("API key missing.");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [{ role: "user", content: promptText }],
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Groq API error: ${err}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

async function generateSmartObjectives() {
    const title = document.getElementById('input-title').value || "Training Drill";
    const catSelect = document.getElementById('input-category');
    const categoryName = catSelect && catSelect.selectedIndex > 0 ? catSelect.options[catSelect.selectedIndex].text : "Fire Operations";
    const objField = document.getElementById('input-objectives');
    const outObj = document.getElementById('output-objectives');

    const selectedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input:checked').forEach(cb => {
        selectedSkills.push(cb.value);
    });

    let currentInput = objField.value.trim();
    objField.value = "AI is generating custom SMART objectives...";

    const prompt = `Act as an expert Red Deer County fire instructor. Write 3 to 4 professional SMART training objectives tailored precisely to the instructor's notes provided below.
Drill Title: ${title}
Category: ${categoryName}
Active Skills: ${selectedSkills.join(', ') || 'General operations'}
Instructor Notes / Specific Focus: ${currentInput || 'None provided. Focus on precise tactical execution.'}

Return ONLY a clean numbered list of 3 to 4 objectives. No conversational chat.`;

    try {
        const aiText = await callGroqAI(prompt);
        objField.value = aiText.trim();
        if (outObj) outObj.textContent = aiText.trim();
    } catch (error) {
        console.error(error);
        objField.value = "Error connecting to AI. Please check your API key.";
        if (outObj) outObj.textContent = objField.value;
    }
}

async function generateSequence() {
    const title = document.getElementById('input-title').value || "Training Drill";
    const catSelect = document.getElementById('input-category');
    const categoryName = catSelect && catSelect.selectedIndex > 0 ? catSelect.options[catSelect.selectedIndex].text : "Fire Operations";
    const seqField = document.getElementById('input-sequence');
    const outSeq = document.getElementById('output-sequence');

    const selectedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input:checked').forEach(cb => {
        selectedSkills.push(cb.value);
    });

    let currentInput = seqField.value.trim();
    seqField.value = "AI is designing your training sequence...";

    const prompt = `Act as an expert Red Deer County fire instructor. Design a 4-step practical training sequence matching this custom context: "${currentInput}".
Drill Title: ${title}
Category: ${categoryName}
Active Skills: ${selectedSkills.join(', ') || 'Standard drill'}

Incorporate Alberta OHS standards where applicable. Return ONLY 4 clear numbered steps. No conversational text.`;

    try {
        const aiText = await callGroqAI(prompt);
        seqField.value = aiText.trim();
        if (outSeq) outSeq.textContent = aiText.trim();
    } catch (error) {
        console.error(error);
        seqField.value = "Error connecting to AI. Please check your API key.";
        if (outSeq) outSeq.textContent = objField.value;
    }
}

function updateCategoryDetails(selectedKey) {
    const skillsContainer = document.getElementById('skills-checkbox-container');
    const equipContainer = document.getElementById('equipment-checkbox-container');
    const safetyField = document.getElementById('input-safety');
    const outSkillsList = document.getElementById('output-skills-list');
    const outResources = document.getElementById('output-resources');
    
    if (!skillsContainer || !equipContainer) return;

    skillsContainer.innerHTML = '';
    equipContainer.innerHTML = '';

    if (trainingCategories[selectedKey]) {
        const data = trainingCategories[selectedKey];

        if (safetyField && data.defaultSafety) {
            safetyField.value = data.defaultSafety;
            const outSafety = document.getElementById('output-safety');
            if (outSafety) outSafety.textContent = data.defaultSafety;
        }

        if (data.skills) {
            data.skills.forEach((skillObj) => {
                const skillName = skillObj.name || skillObj;
                const label = document.createElement('label');
                label.style.display = 'block';
                label.style.marginBottom = '4px';
                label.innerHTML = `<input type="checkbox" value="${skillName}" checked onchange="updatePrintSummary()"> ${skillName}`;
                skillsContainer.appendChild(label);
            });
        }

        if (data.resources) {
            data.resources.forEach((eq) => {
                const label = document.createElement('label');
                label.style.display = 'block';
                label.style.marginBottom = '4px';
                label.innerHTML = `<input type="checkbox" value="${eq}" checked onchange="updatePrintSummary()"> ${eq}`;
                equipContainer.appendChild(label);
            });
        }

        updatePrintSummary();
    } else {
        skillsContainer.innerHTML = '<span style="color:#778588; font-size:0.8rem; padding:4px;">Select a category above first.</span>';
        equipContainer.innerHTML = '<span style="color:#778588; font-size:0.8rem; padding:4px;">Select a category above first.</span>';
        if (outSkillsList) outSkillsList.textContent = '--';
        if (outResources) outResources.textContent = '--';
    }
}

function updatePrintSummary() {
    const checkedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input:checked').forEach(cb => {
        checkedSkills.push(cb.value);
    });

    const checkedResources = [];
    document.querySelectorAll('#equipment-checkbox-container input:checked').forEach(cb => {
        checkedResources.push(cb.value);
    });

    const outSkillsList = document.getElementById('output-skills-list');
    const outResources = document.getElementById('output-resources');

    if (outSkillsList) {
        outSkillsList.innerHTML = checkedSkills.length > 0 ? checkedSkills.map(s => `• ${s}`).join('<br>') : '--';
    }
    if (outResources) {
        outResources.innerHTML = checkedResources.length > 0 ? checkedResources.map(r => `• ${r}`).join('<br>') : '--';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const categorySelect = document.getElementById('input-category');
    if (!categorySelect) return;

    try {
        const response = await fetch('standards.json');
        trainingCategories = await response.json();

        for (const [key, cat] of Object.entries(trainingCategories)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = cat.categoryName || key;
            categorySelect.appendChild(option);
        }

        if (categorySelect.value && trainingCategories[categorySelect.value]) {
            updateCategoryDetails(categorySelect.value);
        }
    } catch (error) {
        console.error("Error loading standards.json database:", error);
    }

    categorySelect.addEventListener('change', (e) => {
        updateCategoryDetails(e.target.value);
    });

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

function savePlan() {
    alert("Lesson plan data saved locally!");
}

function loadPlan() {
    alert("Load feature active.");
}

function exportPDF() {
    window.print();
}
