const mongoose = require("mongoose");

// Define message schema
const messageSchema = new mongoose.Schema({
    message: String,
    user: {
        id: String,
        firstName: String, 
        lastName: String, 
    },
    createdAt: { type: Date, default: Date.now }
});

// Export the Message model
module.exports = mongoose.model("Message", messageSchema);
