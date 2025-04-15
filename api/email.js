// index.js or api/email.js

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end(); // Allow preflight
    return;
  }

  const { email, message } = req.body;

  // Proceed with sending email (e.g. using EmailJS or Nodemailer)
  console.log("📩 Email:", email);
  console.log("📨 Message:", message);

  res.status(200).json({ success: true });
};
