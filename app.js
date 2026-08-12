// Paste your free API key from Google AI Studio here
const GEMINI_API_KEY = "YOUR_API_KEY_HERE"; 

// True AI-Powered Smart Objectives Generator
async function generateSmartObjectives() {
    const title = document.getElementById('input-title').value || "Training Drill";
    const catSelect = document.getElementById('input-category');
    const categoryName = catSelect.options[catSelect.selectedIndex].text;
    const objField = document.getElementById('input-objectives');
    const outObj = document.getElementById('output-objectives');

    const selectedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input:checked').forEach(cb => {
        selectedSkills.push(cb.value);
    });

    let currentInput = objField.value.trim();
    objField.value = "Generating smart objectives with AI...";

    const prompt = `You are a master fire service instructor in Red Deer County, Alberta. Write 3 to 4 professional SMART training objectives for a fire department drill.
- Title: ${title}
- Category: ${categoryName}
- Selected Skills/Standards: ${selectedSkills.join(', ') || 'General operations'}
- Instructor Notes/Focus: ${currentInput || 'Standard operational drill'}

Output ONLY a clean, numbered list of 3 to 4 professional objectives. Do not include extra conversational fluff.`;

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text.trim();
            objField.value = aiText;
            outObj.textContent = aiText;
        } else {
            throw new Error("Invalid response format from API");
        }
    } catch (error) {
        console.error("AI Error:", error);
        objField.value = "Error generating content. Verify your API key.";
        outObj.textContent = objField.value;
    }
}

// True AI-Powered Training Sequence Generator
async function generateSequence() {
    const title = document.getElementById('input-title').value || "Training Drill";
    const catSelect = document.getElementById('input-category');
    const categoryName = catSelect.options[catSelect.selectedIndex].text;
    const seqField = document.getElementById('input-sequence');
    const outSeq = document.getElementById('output-sequence');

    const selectedSkills = [];
    document.querySelectorAll('#skills-checkbox-container input:checked').forEach(cb => {
        selectedSkills.push(cb.value);
    });

    let currentInput = seqField.value.trim();
    seqField.value = "Designing training sequence with AI...";

    const prompt = `You are a master fire service instructor in Red Deer County, Alberta. Create a professional, step-by-step training sequence (numbered 1 to 4) for a fire drill.
- Title: ${title}
- Category: ${categoryName}
- Selected Skills: ${selectedSkills.join(', ') || 'Standard drill'}
- Context/Notes: ${currentInput || 'Standard operational progression'}

Incorporate local standards like Alberta OHS or specific rules if relevant. Output ONLY the numbered steps clearly and concisely.`;

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text.trim();
            seqField.value = aiText;
            outSeq.textContent = aiText;
        } else {
            throw new Error("Invalid response format from API");
        }
    } catch (error) {
        console.error("AI Error:", error);
        seqField.value = "Error generating sequence. Verify your API key.";
        outSeq.textContent = seqField.value;
    }
}
