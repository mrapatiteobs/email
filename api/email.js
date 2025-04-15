const { google } = require("googleapis");
const sheets = google.sheets("v4");
const credentials = require("../../credentials.json"); // Adjust path based on where your JSON is

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { email, message } = req.body;

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const authClient = await auth.getClient();

  const spreadsheetId = "1oap_K_Vh0_VyxbbqfDmtupI45Z1eRJgqGcK0sQUfNhI"; // your Sheet ID
  const range = "Sheet1!A:B"; // change as needed

  await sheets.spreadsheets.values.append({
    auth: authClient,
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: [[email, message]]
    }
  });

  res.status(200).json({ success: true });
};
