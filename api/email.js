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

    // ✅ Parse service account JSON from environment variable
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

    const auth = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    // ✅ Generate ISO timestamp
    const timestamp = new Date().toISOString(); // e.g., 2025-04-15T12:34:56.789Z

    // ✅ Append email, message, and timestamp to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: "1oap_K_Vh0_VyxbbqfDmtupI45Z1eRJgqGcK0sQUfNhI",
      range: "Sheet1!A:C", // updated to include 3 columns
      valueInputOption: "RAW",
      requestBody: {
        values: [[email, message, timestamp]],
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Google Sheets Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
