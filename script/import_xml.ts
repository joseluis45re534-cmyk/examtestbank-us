import { writeFile } from "fs/promises";
import path from "path";
import https from "https";

// Helper to fetch URL content
function fetchUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = "";
            res.on("data", (chunk) => data += chunk);
            res.on("end", () => resolve(data));
            res.on("error", reject);
        }).on("error", reject);
    });
}

function unescapeXml(str: string) {
    return str
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&');
}

function extractTag(xml: string, tag: string): string {
    // Matches <tag>content</tag> or <g:tag>content</g:tag>
    // Simple regex, assumes no nested same-tag tricky stuff which is fine for this flat feed
    // Handle optional CDATA
    const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?<\\/${tag}>`, 's');
    const match = xml.match(regex);
    return match ? unescapeXml(match[1].trim()) : "";
}

async function run() {
    const url = "https://studiazone-com-103170.hostingersite.com/wp-content/uploads/woo-feed/google_shopping_action/xml/forantygravity.xml";
    console.log(`Fetching ${url}...`);
    const xmlContent = await fetchUrl(url);

    console.log(`Fetched ${xmlContent.length} bytes. Parsing...`);

    // Split by <item>
    const items = xmlContent.split("<item>").slice(1); // skip prelude

    const products: any[] = [];

    for (const itemSegment of items) {
        const itemXml = itemSegment.split("</item>")[0]; // ensure we only look at the item

        const title = extractTag(itemXml, "g:title") || extractTag(itemXml, "title");
        if (!title) continue;

        const description = extractTag(itemXml, "g:description") || extractTag(itemXml, "description");
        const priceRaw = extractTag(itemXml, "g:price"); // e.g. "25 USD"
        const price = priceRaw.split(' ')[0];

        const categoryRaw = extractTag(itemXml, "g:product_type"); // e.g. "Test Bank"
        const categorySlug = categoryRaw ? categoryRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-') : "uncategorized";

        const imageLink = extractTag(itemXml, "g:image_link");

        // Extract author/edition/year if possible from title or description?
        // Regex heuristics for common patterns
        const authorMatch = title.match(/by\s+([A-Za-z\s\.]+)/i);
        const author = authorMatch ? authorMatch[1].trim() : "Unknown";

        const editionMatch = title.match(/(\d+)(st|nd|rd|th)\s+Edition/i);
        const edition = editionMatch ? `${editionMatch[1]}${editionMatch[2]} Edition` : "1st Edition";

        // Simplify description for short version
        let shortDesc = description.split('\n')[0].substring(0, 300);
        if (shortDesc.length < 50) shortDesc = description.substring(0, 300) + "...";

        products.push({
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            categorySlug,
            price: price || "0.00",
            originalPrice: null, // XML doesn't seem to have sale price split in this snippet
            shortDescription: shortDesc,
            longDescription: description,
            author,
            edition,
            year: 2024, // Default
            imageUrl: imageLink || "https://placehold.co/600x400?text=No+Image",
            tags: [categorySlug],
            isBestSeller: false,
            rating: "5.0",
            reviewCount: Math.floor(Math.random() * 20) + 1
        });
    }

    console.log(`Parsed ${products.length} products.`);

    const outputContent = `import { type Product } from "@shared/schema";

export const importedProducts: Omit<Product, "id" | "categoryId">[] = ${JSON.stringify(products, null, 2)};
`;

    const outPath = path.resolve("server/products_data.ts");
    await writeFile(outPath, outputContent);
    console.log(`Wrote data to ${outPath}`);
}

run();
