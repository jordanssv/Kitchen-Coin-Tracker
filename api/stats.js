// This file runs on the server (Vercel) to hide your API key.
// 1. Create a folder named 'api' in your project root.
// 2. Save this file as 'stats.js' inside the 'api' folder.
// 3. Add CG_API_KEY to your Vercel Environment Variables.

export default async function handler(request, response) {
    // Get the key from the server-side environment variable
    const apiKey = process.env.CG_API_KEY;

    if (!apiKey) {
        return response.status(500).json({ error: "Server misconfiguration: No API Key found" });
    }

    // Exact list of coins required
    const coinIds = [
        'bitcoin',
        'ethereum',
        'solana',
        'lido-dao',
        'ether-fi',
        'celestia',
        'eigenlayer',
        'ssv-network',
        'rocket-pool',
        'obol-2'
    ];

    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&sparkline=true&price_change_percentage=24h&x_cg_demo_api_key=${apiKey}`;

    try {
        const fetchResponse = await fetch(url);
        
        if (!fetchResponse.ok) {
            return response.status(fetchResponse.status).json({ error: "Failed to fetch from CoinGecko" });
        }

        const data = await fetchResponse.json();

        // Set Cache-Control to 5 minutes (300 seconds) to match your rate limit plan
        // This prevents the server function from running too often if many users visit the site
        response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        
        return response.status(200).json(data);

    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
