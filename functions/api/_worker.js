export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Sleeper API proxy
    if (url.pathname === "/api/sleeper") {
      const path = url.searchParams.get("path");

      if (!path || !path.startsWith("/")) {
        return new Response(
          JSON.stringify({ error: "Invalid Sleeper API path" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      try {
        const response = await fetch(
          "https://api.sleeper.app/v1" + path,
          {
            headers: {
              "User-Agent": "Noke-Football"
            }
          }
        );

        const body = await response.text();

        return new Response(body, {
          status: response.status,
          headers: {
            "Content-Type":
              response.headers.get("Content-Type") ||
              "application/json",
            "Cache-Control": "public, max-age=30"
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

    // Serve the website
    return env.ASSETS.fetch(request);
  }
};
