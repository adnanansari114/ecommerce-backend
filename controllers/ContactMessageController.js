const ContactMessage = require('../models/ContactMessage');

// ✅ User side: send contact message
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ msg: "All fields are required." });

    const newMessage = await ContactMessage.create({ name, email, message });
    res.status(201).json({ msg: "Message sent successfully", data: newMessage });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Admin side: get all messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
