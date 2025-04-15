module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { email, message } = req.body;

  // Load credentials from environment variable
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);

  // TODO: Use credentials to authenticate with Google Sheets
  // (I'll help you with that if needed)

  console.log("📩 Email:", email);
  console.log("📨 Message:", message);

  res.status(200).json({ success: true });
};
