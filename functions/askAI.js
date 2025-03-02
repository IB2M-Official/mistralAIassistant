exports.handler = async (event) => {
    try {
        const { query, history, model, role, subject } = JSON.parse(event.body);
        const apiKey = process.env.MISTRAL_API_KEY;
        const apiUrl = 'https://api.mistral.ai/v1/chat/completions';

        // Vérifier si les champs sont vides et attribuer des valeurs par défaut
        const finalRole = role && role !== "custom" ? role : "assistant";
        const finalSubject = subject && subject !== "custom" ? subject : "général";

        // Construction des messages avec un contexte personnalisé
        const messages = [
            { role: "system", content: `Tu es un ${finalRole} spécialisé en ${finalSubject}. Réponds en fonction de ce sujet.` },
            ...history.map(msg => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text
            })),
            { role: "user", content: query }
        ];

        const requestBody = {
            model: model || "mistral-medium", // Modèle sélectionné
            messages: messages,
            temperature: 0.7,
            max_tokens: 350 // Éviter les coupures sans forcer un trop grand nombre
        };

        console.log("🔍 Envoi de la requête à Mistral :", JSON.stringify(requestBody));

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur API: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify({ response: data.choices?.[0]?.message?.content || "Pas de réponse reçue." })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
