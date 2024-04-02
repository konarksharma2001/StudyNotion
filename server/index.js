// Importing necessary modules and packages
const express = require("express");
const app = express();
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const Message = require("./models/ChatMessage");
const messageRoutes = require("./routes/Chat");

// Setting up port number
const PORT = process.env.PORT || 4000;

// Loading environment variables from .env file
dotenv.config();

// Connecting to database
database.connect();
 
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/", messageRoutes);

// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 }); // Use port 8080 for WebSocket server

wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', async message => {
        const data = JSON.parse(message);
        console.log(`Received: ${data.payload} from client ${data.clientId}`);

        // Save the received message to the database using the Message model
        try {
            const newMessage = new Message({
                message: data.payload,
                user: {
                    id: data.clientId,
                    firstName: data.firstName, // Include sender's first name
                    lastName: data.lastName, // Include sender's last name
                },
				createdAt: new Date(),
            });
            await newMessage.save();
            console.log("Message saved to database:", newMessage);
        } catch (error) {
            console.error("Error saving message to database:", error);
        }

        // Broadcast the message to all connected clients
        const messageToSend = JSON.stringify({
            id: data.clientId, // Ensure id property is included
            message: data.payload,
            firstName: data.firstName,
            lastName: data.lastName,
			createdAt: new Date(),
        });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageToSend);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

