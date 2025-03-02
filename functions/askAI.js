exports.handler = async (event) => {
    try {
        const { query, history } = JSON.parse(event.body);
        const apiKey = process.env.MISTRAL_API_KEY;
        const apiUrl = 'https://api.mistral.ai/v1/chat/completions';

        // Construction des messages avec l'historique
        const messages = history.map(msg => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text
        }));

        messages.push({ role: "user", content: query });

        const requestBody = {
            model: "mistral-large-latest",
            messages: messages,
            temperature: 0.7,
            max_tokens: 200
        };

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
