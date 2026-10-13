// api/ssv.js
// Proxies SSV staking APR. `?kind=latest` (default) or `?kind=history`.
// History is a series of daily means, so it is cached far longer.

const SSV_API = 'https://api.ssv.network/api/v4/mainnet/apr';

// Edge cache lifetime per endpoint, in seconds
const CACHE_SECONDS = {
    latest: 3600,       // 1 hour
    history: 43200      // 12 hours
};

export default async function handler(request, response) {
    const kind = request.query?.kind === 'history' ? 'history' : 'latest';

    try {
        const fetchResponse = await fetch(`${SSV_API}/${kind}`, { headers: { accept: 'application/json' } });

        if (!fetchResponse.ok) {
            throw new Error('Failed to fetch from SSV API');
        }

        const data = await fetchResponse.json();

        response.setHeader('Cache-Control', `s-maxage=${CACHE_SECONDS[kind]}, stale-while-revalidate`);

        return response.status(200).json(data);
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
