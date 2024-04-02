const Message = require('../models/ChatMessage');

exports.getAllMessagesController = async (req, res) => {
    try {
        const messages = await Message.find();
        return res.status(200).json({messages});
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};