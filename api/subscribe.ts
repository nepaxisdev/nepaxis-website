// api/subscribe.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

// These variables are loaded securely from Vercel's environment settings.
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;

// The type for the request body you expect
interface SubscribeBody {
	email: string;
}

// The Vercel function signature now uses the imported types
export default async (req: VercelRequest, res: VercelResponse) => {
	// Only accept POST requests
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	try {
		const { email } = req.body as SubscribeBody;
		if (!email) {
			return res.status(400).json({ message: "Email is required" });
		}

		const DC = MAILCHIMP_API_KEY.split("-")[1];
		const MAILCHIMP_URL = `https://${DC}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

		const authString = `apikey:${MAILCHIMP_API_KEY}`;
		const encodedAuth = Buffer.from(authString).toString("base64");

		const response = await fetch(MAILCHIMP_URL, {
			method: "POST",
			headers: {
				Authorization: `Basic ${encodedAuth}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email_address: email,
				status: "subscribed",
			}),
		});

		const data = await response.json();

		if (response.ok) {
			return res
				.status(200)
				.json({ message: "Successfully subscribed!", member: data });
		} else {
			// Mailchimp error response
			return res.status(response.status).json(data);
		}
	} catch (error) {
		console.error("Subscription error:", error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: (error as Error).message,
		});
	}
};
