
import { importedProducts } from "../server/products_data";
import fs from "fs";
import path from "path";

function escapeSql(str: string | null | undefined): string {
    if (str === null || str === undefined) return "NULL";
    return "'" + str.replace(/'/g, "''").replace(/\n/g, "\\n") + "'";
}

const sqlHeader = `
-- Full Product Seed
-- Clears existing products to avoid duplicates during re-seed
DELETE FROM products;
DELETE FROM sqlite_sequence WHERE name='products';
`;

let fullSql = sqlHeader;
const BATCH_SIZE = 50;

for (let i = 0; i < importedProducts.length; i += BATCH_SIZE) {
    const batch = importedProducts.slice(i, i + BATCH_SIZE);

    fullSql += `\nINSERT INTO products (title, slug, short_description, long_description, price, image_url, category_id, author, edition, is_best_seller, review_count, file_format) VALUES\n`;

    const values = batch.map(p => {
        let catId = 1;
        if ((p.categorySlug || "").includes("medical")) catId = 2;
        if ((p.categorySlug || "").includes("business")) catId = 3;

        return `(${escapeSql(p.title)}, ${escapeSql(p.slug)}, ${escapeSql(p.shortDescription)}, ${escapeSql(p.longDescription)}, ${p.price || 0}, ${escapeSql(p.imageUrl)}, ${catId}, ${escapeSql(p.author)}, ${escapeSql(p.edition)}, ${p.isBestSeller ? 1 : 0}, ${p.reviewCount || 0}, 'PDF')`;
    }).join(",\n");

    fullSql += `${values};\n`;
}

const outputPath = path.join(process.cwd(), "seed_products.sql");
fs.writeFileSync(outputPath, fullSql);

console.log(`Generated seed_products.sql with ${importedProducts.length} products in batches of ${BATCH_SIZE}.`);
