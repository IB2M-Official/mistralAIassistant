const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { query } = JSON.parse(event.body);
    const apiKey = process.env.MISTRAL_API_KEY;
    const apiUrl = 'https://api.mistral.ai/v1/ask';

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ query })
    });

    const data = await response.json();
    return {
        statusCode: 200,
        body: JSON.stringify({ response: data.response })
    };
};
