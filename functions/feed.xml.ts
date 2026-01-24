
import { storage, initializeStorage } from '../server/storage';
import { D1Storage } from '../server/storage_d1';

export const onRequest = async (context: any) => {
    if (context.env.DB) {
        initializeStorage(new D1Storage(context.env.DB));
    }

    try {
        const products = await storage.getProducts();
        const baseUrl = "https://examtestbank.us";

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>Exam Test Bank US</title>
<link>${baseUrl}</link>
<description>Premium quality nursing, medical, and business test banks.</description>
`;

        products.forEach(p => {
            const imageUrl = p.imageUrl.replace(/studiazone-com-103170\.hostingersite\.com/g, "studiazone.com");
            xml += `
<item>
<g:id>${p.id}</g:id>
<g:title><![CDATA[${p.title}]]></g:title>
<g:description><![CDATA[${p.shortDescription}]]></g:description>
<g:link>${baseUrl}/product/${p.slug}</g:link>
<g:image_link>${imageUrl}</g:image_link>
<g:condition>new</g:condition>
<g:availability>in stock</g:availability>
<g:price>${p.price} USD</g:price>
<g:brand>Exam Test Bank US</g:brand>
<g:google_product_category>6171</g:google_product_category>
</item>`;
        });

        xml += `
</channel>
</rss>`;

        return new Response(xml, {
            headers: {
                "Content-Type": "application/xml",
            },
        });
    } catch (error) {
        return new Response("Failed to generate feed", { status: 500 });
    }
};
