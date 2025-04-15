import { google } from "googleapis";

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { email, message } = req.body;

    // ✅ Basic validation
    if (!email || !message) {
      return res.status(400).json({ success: false, error: "Missing email or message" });
    }

    // ✅ Load credentials from Vercel environment variables
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const spreadsheetId = "1oap_K_Vh0_VyxbbqfDmtupI45Z1eRJgqGcK0sQUfNhI"; // your sheet ID

    const auth = new google.auth.JWT(
      clientEmail,
      null,
      privateKey,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    console.log("📨 Incoming form submission:", { email, message });

    // ✅ Append to the next available row in columns A & B
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:B", // <-- change "Sheet1" if needed
      valueInputOption: "RAW",
      requestBody: {
        values: [[email, message]],
      },
    });

    console.log("✅ Google Sheets append result:", appendResponse.data.updates);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error writing to Google Sheets:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
