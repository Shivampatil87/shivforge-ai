const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions'
const model = "openrouter/auto"

const frontendUrl =
    process.env.FRONTEND_URL || process.env.Frontend_URL || 'http://localhost:5173'

const PLACEHOLDER_KEYS = new Set([
    'YOUR_OPENROUTER_KEY',
    'USE YOUR KEY',
    'USE YOUR OPENROUTER KEY',
    'USE YOUR OPENROUTER_API_KEY',
])

const getOpenRouterApiKey = () => {
    const raw = process.env.OPENROUTER_API_KEY?.trim().replace(/^['"]|['"]$/g, '')
    if (!raw || PLACEHOLDER_KEYS.has(raw.toUpperCase())) {
        throw new Error(
            'OpenRouter API key is not configured. Add OPENROUTER_API_KEY to backend/.env (get one at https://openrouter.ai/keys)',
        )
    }
    return raw
}

export const generateResponse = async (prompt) => {
    const apiKey = getOpenRouterApiKey()

    const res = await fetch(openRouterUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': frontendUrl,
            'X-Title': 'AI Website Builder',
        },
        body: JSON.stringify({
            model,
            messages: [
                {
                    role: 'system',
                    content: "You must return only valid raw JSON",
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature:0.2
        }),
    });
    if (!res.ok) {
        const err = await res.text()
        if (res.status === 401) {
            throw new Error(
                'OpenRouter authentication failed. Check that OPENROUTER_API_KEY in backend/.env is valid (https://openrouter.ai/keys)',
            )
        }
        throw new Error(`OpenRouter error (${res.status}): ${err}`)
    }

    const data = await res.json()
    return data.choices[0].message.content
}