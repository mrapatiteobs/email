const { google } = require('googleapis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST allowed' });
  }

  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ success: false, message: 'Missing data' });
  }

  // Load credentials from environment
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  const spreadsheetId = process.env.SHEET_ID;

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1', // or your desired sheet range
      valueInputOption: 'RAW',
      requestBody: {
        values: [[email, message, new Date().toISOString()]],
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
