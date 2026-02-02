
import { api } from "./shared/routes";

async function run() {
    console.log("Attempting to create order with number totalAmount...");

    const payload = {
        email: "test@example.com",
        totalAmount: 45, // Number, not string!
        items: [
            { productId: 1, quantity: 1 }
        ]
    };

    try {
        const res = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

run();
