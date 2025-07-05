// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/send", async (req, res) => {
  const { name, email, phone, issue } = req.body;

  const complaintId = uuidv4().split("-")[0].toUpperCase();

  // ✅ GoDaddy SMTP Transport
  const transporter = nodemailer.createTransport({
    host: "smtp.secureserver.net",
    port: 465,
    secure: true,
    auth: {
      user: "support@sbkch.com",      // Replace with your full GoDaddy email
      pass: "4C&3tY5?388QuZn",     // Use your GoDaddy email password
    },
  });

  const supportMailOptions = {
    from: "support@sbkch.com",
    to: "support@sbkch.com",
    subject: `New Complaint #${complaintId}`,
    text: `Complaint ID: ${complaintId}
Name: ${name}
Email: ${email}
Phone: ${phone}
Issue: ${issue}`,
  };

  const customerMailOptions = {
    from: "support@sbkch.com",
    to: email,
    subject: `Your Complaint #${complaintId} Received`,
    text: `Hi ${name},\n\nYour complaint has been received.\n\nComplaint ID: ${complaintId}\n\nOur team will reach out to you within 24–48 hours.\n\nThank you!\nTeam sbkch.com`,
  };

  try {
    await transporter.sendMail(supportMailOptions);
    await transporter.sendMail(customerMailOptions);
    res.status(200).json({ message: "Emails sent successfully", complaintId });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: "Failed to send emails" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
