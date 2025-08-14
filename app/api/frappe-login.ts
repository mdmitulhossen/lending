/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/frappe-login.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const frappeRes = await fetch('https://lending12.m.frappe.cloud/api/method/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        const data = await frappeRes.json();
        res.status(frappeRes.status).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}
