// This function runs on a server, not in the browser.
// It will fetch the stats from the API and send them to your website.

export default async function handler(request, response) {
    // The API URL we want to get data from.
    const statsApiUrl = 'http://87.106.100.210:6007/stats';

    try {
        const apiResponse = await fetch(statsApiUrl);

        // If the API server gives an error, we forward that.
        if (!apiResponse.ok) {
            return response.status(apiResponse.status).json({ message: 'Failed to fetch stats from the bot API.' });
        }

        const statsData = await apiResponse.json();

        // Send the fetched data back to the browser with a success status.
        // We also add a cache header to prevent this from being called too often.
        response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // Cache for 60 seconds
        return response.status(200).json(statsData);

    } catch (error) {
        console.error("Error in stats proxy:", error);
        return response.status(500).json({ message: 'An internal server error occurred.' });
    }
}
