exports.handler = async (event) => {
    try {
        const { query } = JSON.parse(event.body);
        const apiKey = process.env.MISTRAL_API_KEY;
        const apiUrl = 'https://api.mistral.ai/v1/chat/completions'; // Vérifie bien cet endpoint

        const requestBody = {
            model: "mistral-7b", // Vérifie si ce modèle existe
            messages: [{ role: "user", content: query }],
            temperature: 0.7
        };

        console.log("🔍 Envoi de la requête à l'API Mistral :", requestBody);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text(); // Lire la réponse d'erreur
            throw new Error(`Erreur API: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ Réponse API Mistral :", data);

        return {
            statusCode: 200,
            body: JSON.stringify({ response: data.choices?.[0]?.message?.content || "Pas de réponse reçue." })
        };
    } catch (error) {
        console.error("❌ Erreur dans le handler :", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
