// Quick test function - replace with your new credentials
export async function testAuth() {
    // Replace these with your NEW credentials from Frappe
    const API_KEY = "YOUR_NEW_API_KEY";
    const API_SECRET = "YOUR_NEW_API_SECRET";

    try {
        console.log("Testing authentication...");

        const response = await fetch("https://lending12.m.frappe.cloud/api/method/ping", {
            method: "GET",
            headers: {
                "Authorization": `token ${API_KEY}:${API_SECRET}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        const result = await response.json();

        console.log("Status:", response.status);
        console.log("Response:", result);

        if (response.ok && result.message === "pong") {
            console.log("✅ Authentication successful!");
            return true;
        } else {
            console.log("❌ Authentication failed");
            return false;
        }

    } catch (error) {
        console.error("❌ Network error:", error);
        return false;
    }
}

// Test function for your main API endpoint
export async function POST(req: Request) {
    const body = await req.json();

    // Use your NEW credentials here
    const API_KEY = process.env.FRAPPE_API_KEY?.trim();
    const API_SECRET = process.env.FRAPPE_API_SECRET?.trim();

    if (!API_KEY || !API_SECRET) {
        return new Response(JSON.stringify({
            error: "Missing API credentials"
        }), { status: 500 });
    }

    try {
        const response = await fetch("https://lending12.m.frappe.cloud/api/resource/User", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${API_KEY}:${API_SECRET}`,
                "Accept": "application/json"
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            error: error.message
        }), { status: 500 });
    }
}