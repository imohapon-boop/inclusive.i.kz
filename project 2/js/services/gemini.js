class GeminiService {
    constructor() {
        // Wrapper for Google Gemini API Client calls.
        // In the future this should be switched to a secure backend endpoint / Firebase Cloud Function instead of client-side logic.
        this.apiKey = 'AIzaSyBPlEwBAxo1l1D4EDT7gjhHowsj2Bk4JwM';
        this.endpointUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    }

    async analyzeTranscription(text) {
        const prompt = `Analyze this text spoken in Russian: "${text}"

Return ONLY a valid JSON object:
{
  "name": "Only the person's name. If not found, empty string.",
  "phone": "Phone number as 10-11 digits. Convert spoken words to digits. If not found, empty string.",
  "category": "One of: 'Сопровождение', 'Продукты/Аптека', 'Помощь с коляской', 'Помощь с краской', 'Другое'. Map: аптека/лекарства→'Продукты/Аптека', проводить→'Сопровождение'.",
  "location": "Only the address or landmark. NOT the full text. If not found, empty string.",
  "time": "ISO time string or null. 'через час'→calculate, 'завтра в 10'→calculate.",
  "volunteers_count": "Return the number of volunteers as a plain integer (e.g., 2, not 'двое'). If not specified, default to 1. MUST NOT BE A STRING.",
  "submit": "true if user says 'разместить', 'отправить', or 'всё верно'. Otherwise false."
}
CRITICAL: name must NEVER contain address. location must NEVER contain name. Respond ONLY with JSON.`;

        const response = await fetch(this.endpointUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const raw = await response.json();
        let aiText = raw.candidates[0].content.parts[0].text;
        aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(aiText);
    }
}
window.geminiService = new GeminiService();
