import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export function TagInjector() {
    const { data: settings } = useQuery<Record<string, string>>({
        queryKey: ["/api/settings"],
    });

    useEffect(() => {
        if (!settings) return;

        // Function to inject tags safely
        const inject = (html: string, location: 'head' | 'body-start' | 'footer') => {
            if (!html) return;

            // For simple HTML strings, we can append them. 
            // Better yet, create a temporary container and move children.
            const temp = document.createElement('div');
            temp.innerHTML = html.trim();
            const elements = Array.from(temp.childNodes);

            elements.forEach(node => {
                const marker = `data-injected-at="${location}"`;

                // Skip if already injected (prevents duplicates in dev/re-renders)
                // However, we need to handle updates. 
                // Let's clear previous injections first for this location.

                if (node.nodeType === 1) { // Element
                    (node as HTMLElement).setAttribute('data-injected', location);
                }

                if (location === 'head') {
                    document.head.appendChild(node);
                } else if (location === 'body-start') {
                    document.body.prepend(node);
                } else {
                    document.body.appendChild(node);
                }
            });
        };

        // Cleanup previous injections
        const cleanup = () => {
            document.querySelectorAll('[data-injected]').forEach(el => el.remove());
        };

        cleanup();
        inject(settings.inject_head, 'head');
        inject(settings.inject_body_start, 'body-start');
        inject(settings.inject_footer, 'footer');

    }, [settings]);

    return null; // This component doesn't render anything
}
