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
    const categoryName = catSelect ? catSelect.options[catSelect.selectedIndex].text : "Fire Operations";
    const objField = document.getElementById('input-objectives');
    const outObj = document.getElementById('output-objectives');

    const selectedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input:checked').forEach(cb => {
        selectedSkills.push(cb.value);
    });

    let currentInput = objField.value.trim();
    objField.value = "AI is generating custom SMART objectives...";

    const prompt = `You are a master fire service instructor in Red Deer County, Alberta. Write 3 to 4 professional SMART training objectives for a fire department drill.
- Title: ${title}
- Category: ${categoryName}
- Selected Skills: ${selectedSkills.join(', ') || 'General operations'}
- Instructor Notes/Focus: ${currentInput || 'Standard operational drill'}

Output ONLY a clean, numbered list of 3 to 4 professional objectives. No conversational markdown headers.`;

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

    const prompt = `You are a master fire service instructor in Red Deer County, Alberta. Create a professional, step-by-step training sequence (numbered 1 to 4) for a fire drill.
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

function updateCategoryDetails(selectedKey) {
    const skillsContainer = document.getElementById('skills-checkbox-container');
    const equipContainer = document.getElementById('equipment-checkbox-container');
    const safetyField = document.getElementById('input-safety');
    
    if (!skillsContainer || !equipContainer) return;

    skillsContainer.innerHTML = '';
    equipContainer.innerHTML = '';

    if (trainingCategories[selectedKey]) {
        const data = trainingCategories[selectedKey];

        // Populate default safety text if available
        if (safetyField && data.defaultSafety) {
            safetyField.value = data.defaultSafety;
            const outSafety = document.getElementById('output-safety');
            if (outSafety) outSafety.textContent = data.defaultSafety;
        }

        // Populate Skills (handling object structure with name and standard)
        if (data.skills) {
            data.skills.forEach((skillObj) => {
                const label = document.createElement('label');
                label.style.display = 'block';
                label.style.marginBottom = '4px';
                const skillName = skillObj.name || skillObj;
                label.innerHTML = `<input type="checkbox" value="${skillName}" checked> ${skillName}`;
                skillsContainer.appendChild(label);
            });
        }

        // Populate Equipment / Resources
        if (data.resources) {
            data.resources.forEach((eq) => {
                const label = document.createElement('label');
                label.style.display = 'block';
                label.style.marginBottom = '4px';
                label.innerHTML = `<input type="checkbox" value="${eq}" checked> ${eq}`;
                equipContainer.appendChild(label);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const categorySelect = document.getElementById('input-category');
    if (!categorySelect) return;

    // Fetch standards.json dynamically
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
