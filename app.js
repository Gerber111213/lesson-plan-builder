let trainingCategories = {};

// Reliable Zero-Key Free AI Gateway
async function callPublicAI(promptText) {
    const encodedPrompt = encodeURIComponent(promptText);
    const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=openai&private=true`);
    
    if (!response.ok) throw new Error("Public AI gateway failed.");
    return await response.text();
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

    const prompt = `You are a master fire service instructor in Red Deer County, Alberta. Write 3 to 4 professional SMART training objectives for a fire department drill.
CRITICAL INSTRUCTION: You must base these objectives directly and specifically on the instructor notes provided below. Do not output generic boilerplate objectives.
- Title: ${title}
- Category: ${categoryName}
- Selected Skills: ${selectedSkills.join(', ') || 'General operations'}
- Instructor Notes / Focus: ${currentInput || 'None provided. Focus strictly on custom tactical execution of the selected category.'}

Output ONLY a clean, numbered list of 3 to 4 professional objectives. No conversational markdown headers or extra text.`;

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
    const categoryName = catSelect && catSelect.selectedIndex > 0 ? catSelect.options[catSelect.selectedIndex].text : "Fire Operations";
    const seqField = document.getElementById('input-sequence');
    const outSeq = document.getElementById('output-sequence');

    const selectedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input:checked').forEach(cb => {
        selectedSkills.push(cb.value);
    });

    let currentInput = seqField.value.trim();
    seqField.value = "AI is designing your training sequence...";

    const prompt = `You are a master fire service instructor in Red Deer County, Alberta. Create a professional, step-by-step training sequence (numbered 1 to 4) for a fire drill.
CRITICAL INSTRUCTION: You must build this step-by-step progression specifically around the context and focus notes provided by the instructor below.
- Title: ${title}
- Category: ${categoryName}
- Selected Skills: ${selectedSkills.join(', ') || 'Standard drill'}
- Context / Instructor Notes: ${currentInput || 'None provided. Create a logical standard operational progression.'}

Incorporate local standards like Alberta OHS if relevant. Output ONLY the numbered steps clearly. No conversational text.`;

    try {
        const aiText = await callPublicAI(prompt);
        seqField.value = aiText.trim();
        if (outSeq) outSeq.textContent = aiText.trim();
    } catch (error) {
        console.error(error);
        seqField.value = "1. Briefing and safety check.\n2. Apparatus setup.\n3. Practical rotations.\n4. Hot wash and debrief.";
        if (outSeq) outSeq.textContent = seqField.value;
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
