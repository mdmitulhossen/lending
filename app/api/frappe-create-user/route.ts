/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const API_KEY = process.env.FRAPPE_API_KEY;
        const API_SECRET = process.env.FRAPPE_API_SECRET;

        if (!API_KEY || !API_SECRET) {
            return new Response(JSON.stringify({ error: "Missing Frappe API credentials" }), { status: 500 });
        }

        const frappeRes = await fetch("https://lending12.m.frappe.cloud/api/resource/User", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${API_KEY}:${API_SECRET}`,
            },
            body: JSON.stringify(body),
        });

        const data = await frappeRes.json();
        return new Response(JSON.stringify(data), { status: frappeRes.status });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
