const Enquiry = require('../models/Enquiry');
const nodemailer = require("nodemailer");

// utility: send email notification
async function sendNotificationEmail(enquiry) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // your gmail
        pass: process.env.SMTP_PASS  // app password
      }
    });

    await transporter.sendMail({
      from: `"Paragliding Website" <${process.env.SMTP_USER}>`,
      to: "paraglidingmantrapune@gmail.com", // where you want notifications
      subject: "New Enquiry Received 🚀",
      text: `
📩 New enquiry received:

Name: ${enquiry.firstName} ${enquiry.lastName}
Phone: ${enquiry.phone}
Email: ${enquiry.email || "Not provided"}

Query:
${enquiry.query}

---
This is an automated message.
      `
    });
  } catch (err) {
    console.error("Failed to send notification email:", err.message);
  }
}

// @desc Create new enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, query } = req.body;

    if (!firstName || !lastName || !phone || !query) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const enquiry = new Enquiry({ firstName, lastName, phone, email, query });
    await enquiry.save();

    // send email after saving
    await sendNotificationEmail(enquiry);

    res.status(201).json({ message: "Enquiry submitted successfully", enquiry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all enquiries (admin only)
exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Mark enquiry reviewed
exports.markReviewed = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: 'reviewed' },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

    res.json({ message: "Enquiry marked as reviewed", enquiry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
