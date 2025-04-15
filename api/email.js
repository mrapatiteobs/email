export default async function handler(req, res) {
  // ✅ Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { email, message } = req.body;

    console.log("📩 Email:", email);
    console.log("📨 Message:", message);

    // TODO: Add Google Sheets logic here (I'll help next if you want!)

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
