// api/sentiment.js
// This proxy bypasses CORS issues by fetching Alternative.me data server-side.

export default async function handler(request, response) {
    try {
        const fetchResponse = await fetch('https://api.alternative.me/fng/?limit=1');
        
        if (!fetchResponse.ok) {
            throw new Error('Failed to fetch from Alternative.me');
        }

        const data = await fetchResponse.json();

        // Cache for 1 hour (3600 seconds) since F&G index updates daily
        response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        
        return response.status(200).json(data);
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}