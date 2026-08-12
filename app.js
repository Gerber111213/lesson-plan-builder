// AI-Powered Smart Objectives & Sequence Generator via Gemini API
const GEMINI_API_KEY = "AIzaSyD-YourProxyOrWorkingKeyPlaceholder"; // We can plug a functional endpoint key here

async function callGeminiAI(promptText) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
        })
    });
    const data = await response.json();
    if (data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text.trim();
    } else {
        throw new Error("AI generation failed.");
    }
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
        const aiText = await callGeminiAI(prompt);
        objField.value = aiText;
        if (outObj) outObj.textContent = aiText;
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

Incorporate local standards like Alberta OHS or specific rules if relevant. Output ONLY the numbered steps clearly.`;

    try {
        const aiText = await callGeminiAI(prompt);
        seqField.value = aiText;
        if (outSeq) outSeq.textContent = aiText;
    } catch (error) {
        console.error(error);
        seqField.value = "1. Briefing and safety check.\n2. Apparatus setup.\n3. Practical rotations.\n4. Hot wash and debrief.";
        if (outSeq) outSeq.textContent = seqField.value;
    }
}
