export default async function handler(req, res) {
  // ✅ Enable CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    console.log("📩 Email:", email);
    console.log("📨 Message:", message);

    // You can add your email sending logic here with EmailJS, Nodemailer, etc.

    return res.status(200).json({ success: true, message: "Message received!" });
  } catch (err) {
    console.error("❌ Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
