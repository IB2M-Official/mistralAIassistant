exports.handler = async (event) => {
    try {
        const { query } = JSON.parse(event.body);
        const apiKey = process.env.MISTRAL_API_KEY;
        const apiUrl = 'https://api.mistral.ai/v1/chat/completions'; // Vérifie si c'est le bon endpoint

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Réponse API Mistral :", data); // 🔍 Vérifie ce que renvoie l'API

        return {
            statusCode: 200,
            body: JSON.stringify({ response: data.response || "Pas de réponse reçue." })
        };
    } catch (error) {
        console.error("Erreur dans le handler :", error); // 🔍 Log l'erreur
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
