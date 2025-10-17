const axios = require("axios");

const sendEmail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Trendora", email: process.env.BREVO_USER },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully via Brevo API");
  } catch (err) {
    console.error(
      "❌ Email send failed:",
      err.response?.data || err.message
    );
  }
};

module.exports = sendEmail;
