import { google } from "googleapis";

export default async function handler(req, res) {
  // ✅ Set correct CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const spreadsheetId = "1oap_K_Vh0_VyxbbqfDmtupI45Z1eRJgqGcK0sQUfNhI";

    const auth = new google.auth.JWT(
      clientEmail,
      null,
      privateKey,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:B", // Use your actual sheet name
      valueInputOption: "RAW",
      requestBody: {
        values: [[email, message]],
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Google Sheets Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
