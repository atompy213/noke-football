export async function onRequestGet(context) {
    const url = new URL(context.request.url);
    const path = url.searchParams.get("path");

    if (!path) {
        return new Response(
            JSON.stringify({ error: "Missing Sleeper API path" }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    // Only allow requests to Sleeper's API.
    if (!path.startsWith("/")) {
        return new Response(
            JSON.stringify({ error: "Invalid API path" }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    const sleeperURL =
        "https://api.sleeper.app/v1" + path;

    try {

        const response = await fetch(sleeperURL, {
            method: "GET",
            headers: {
                "User-Agent": "Noke-Football"
            }
        });

        const body = await response.text();

        return new Response(body, {
            status: response.status,
            headers: {
                "Content-Type":
                    response.headers.get("Content-Type") ||
                    "application/json",
                "Cache-Control":
                    "public, max-age=30"
            }
        });

    } catch (error) {

        return new Response(
            JSON.stringify({
                error: "Unable to reach Sleeper",
                details: error.message
            }),
            {
                status: 502,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}
