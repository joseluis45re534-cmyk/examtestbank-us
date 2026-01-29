export const onRequest = async (context: any) => {
    const url = new URL(context.request.url);
    const imageUrl = url.searchParams.get("url");

    if (!imageUrl) {
        return new Response("Missing url parameter", { status: 400 });
    }

    try {
        const imageResponse = await fetch(imageUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://studiazone.com/" // Pretend we are the origin site
            }
        });

        if (!imageResponse.ok) {
            return new Response(`Failed to fetch image: ${imageResponse.statusText}`, { status: imageResponse.status });
        }

        const headers = new Headers(imageResponse.headers);
        // Ensure CORS is allowed for our domain
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Cache-Control", "public, max-age=31536000, immutable"); // Aggressive caching

        return new Response(imageResponse.body, {
            status: 200,
            headers: headers
        });
    } catch (error: any) {
        return new Response(`Error fetching image: ${error.message}`, { status: 500 });
    }
};
