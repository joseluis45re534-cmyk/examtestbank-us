import { readFile, writeFile } from "fs/promises";
import path from "path";

// Simple CSV Parser that handles quoted fields and newlines
function parseCSV(text: string) {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                currentField += '"';
                i++; // Skip escaped quote
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentField);
            currentField = "";
        } else if (char === '\n' && !insideQuotes) {
            currentRow.push(currentField); // Push last field of the row
            rows.push(currentRow);
            currentRow = [];
            currentField = "";
        } else if (char === '\r' && !insideQuotes) {
            // Ignore CR
        } else {
            currentField += char;
        }
    }
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }
    return rows;
}

// Map CSV columns to Object
function mapToProducts(rows: string[][]) {
    const headers = rows[0].map(h => h.trim());
    const products: any[] = [];

    // Helper to get index
    const getIdx = (name: string) => headers.indexOf(name);

    const idxName = getIdx("Name");
    const idxShortDesc = getIdx("Short description");
    const idxDesc = getIdx("Description");
    const idxRegPrice = getIdx("Regular price");
    const idxSalePrice = getIdx("Sale price");
    const idxCategories = getIdx("Categories");
    const idxImages = getIdx("Images");
    const idxTags = getIdx("Tags");
    const idxAuthor = getIdx("Author"); // Might not exist, check CSV
    const idxIsbn = getIdx("GTIN, UPC, EAN, or ISBN");

    // Skip header
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < headers.length) continue; // Skip malformed rows

        const title = row[idxName];
        if (!title) continue;

        // Price Logic
        let price = row[idxRegPrice];
        let originalPrice = "";
        if (row[idxSalePrice]) {
            originalPrice = row[idxRegPrice];
            price = row[idxSalePrice];
        }

        // Category Logic (Take the last part of hierarchy >)
        let categorySlug = "uncategorized";
        const catRaw = row[idxCategories];
        if (catRaw) {
            // "Test Bank > Anatomy, Test Bank" -> take first one "Test Bank > Anatomy" -> "Anatomy"
            // Simplify: just lowercase and slugify the first meaningful word
            const parts = catRaw.split(',')[0].split('>');
            const mainCat = parts[parts.length - 1].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
            if (mainCat) categorySlug = mainCat;
        }

        // Image Logic (Take first URL)
        let imageUrl = "https://placehold.co/600x400?text=No+Image";
        if (row[idxImages]) {
            const urls = row[idxImages].split(',').map(u => u.trim());
            if (urls.length > 0) imageUrl = urls[0];
        }

        // Convert short description HTML to plain text somewhat or keep it?
        // The schema usually expects text or simple HTML.
        // Let's strip massive HTML from short description if it looks like a full page.
        let shortDescription = row[idxShortDesc] || row[idxDesc] || "";
        // Clean up basic HTML tags for cleaner display if needed, but keeping it as is is safer for now.

        const product = {
            title: title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            categorySlug: categorySlug,
            price: price || "0.00",
            originalPrice: originalPrice || null,
            shortDescription: shortDescription.substring(0, 500) + (shortDescription.length > 500 ? "..." : ""), // Truncate for performance
            longDescription: row[idxDesc] || "",
            author: "Unknown", // CSV didn't seem to have Author column explicitly in the first few lines
            edition: "1st Edition", // Placeholder
            year: 2024,
            imageUrl: imageUrl,
            tags: row[idxTags] ? row[idxTags].split(',').map(t => t.trim()) : [],
            isBestSeller: false,
            rating: "5.0", // Default nice rating
            reviewCount: Math.floor(Math.random() * 50) + 5
        };
        products.push(product);
    }
    return products;
}

async function run() {
    const csvPath = "C:/Users/pc/Downloads/wc-product-export-22-1-2026-1769091564042.csv";
    console.log(`Reading ${csvPath}...`);
    const content = await readFile(csvPath, "utf-8");

    console.log("Parsing CSV...");
    const rows = parseCSV(content);

    console.log(`Found ${rows.length} rows.`);
    const products = mapToProducts(rows);
    console.log(`Mapped ${products.length} products.`);

    const outputContent = `import { type Product } from "@shared/schema";

export const importedProducts: Omit<Product, "id" | "categoryId">[] = ${JSON.stringify(products, null, 2)};
`;

    const outPath = path.resolve("server/products_data.ts");
    await writeFile(outPath, outputContent);
    console.log(`Wrote data to ${outPath}`);
}

run();
