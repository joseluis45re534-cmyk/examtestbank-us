
export const onRequest: PagesFunction<{ DB: D1Database }> = async (context) => {
    const response = await context.next();
    const contentType = response.headers.get('content-type') || '';

    // Only inject tags into HTML responses
    if (!contentType.includes('text/html')) {
        return response;
    }

    // Don't inject on API or Feed routes if they happen to return HTML
    const url = new URL(context.request.url);
    if (url.pathname.startsWith('/api') || url.pathname.endsWith('.xml')) {
        return response;
    }

    try {
        // Fetch settings from D1
        const { results } = await context.env.DB.prepare("SELECT * FROM settings").all();
        const settings = (results as any[]).reduce((acc, s) => {
            acc[s.key] = s.value;
            return acc;
        }, {});

        // Use HTMLRewriter to inject tags at the correct positions
        return new HTMLRewriter()
            .on('head', {
                element(element) {
                    if (settings.inject_head) {
                        element.append(settings.inject_head, { html: true });
                    }
                },
            })
            .on('body', {
                element(element) {
                    if (settings.inject_body_start) {
                        element.prepend(settings.inject_body_start, { html: true });
                    }
                    if (settings.inject_footer) {
                        element.append(settings.inject_footer, { html: true });
                    }
                },
            })
            .transform(response);
    } catch (error) {
        // If anything fails (like DB not initialized), return original response
        console.error("Middleware Tag Injection Error:", error);
        return response;
    }
};
