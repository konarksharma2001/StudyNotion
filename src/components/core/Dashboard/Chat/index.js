import React, { useEffect, useState, useRef } from "react";
import { MdSend } from "react-icons/md";
import { getAllMessages } from "../../../../services/operations/chatAPI";
import { MoonLoader } from "react-spinners";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [clientId, setClientId] = useState("");
    const messagesEndRef = useRef(null);

    const localUser = JSON.parse(localStorage.getItem("user"));

    // Function to fetch messages from the backend
    const fetchMessages = async () => {
        setLoading(true); // Set loading to true when fetching messages
        const fetchedMessages = await getAllMessages();
        setMessages(fetchedMessages);
        setLoading(false); // Set loading to false after fetching messages
    };

    useEffect(() => {
        fetchMessages(); // Fetch messages on component mount
    }, []);
    

    useEffect(() => {
        const websocket = new WebSocket("ws://127.0.0.1:8080");

        websocket.onopen = () => {
            console.log("WebSocket is connected");
            // Generate a unique client ID
            const id = Math.floor(Math.random() * 1000);
            //console.log("Client ID generated:", id);
            setClientId(id);
        };

        websocket.onmessage = async (evt) => {
            const messageFromServer = JSON.parse(evt.data);
           // console.log("Message received from server:", messageFromServer);
            setMessages((prevMessages) => [...prevMessages, messageFromServer]);
            fetchMessages();
            setLoading(false);
        };



        websocket.onclose = () => {
            //console.log("WebSocket is closed");
        };

        setWs(websocket);

        return () => {
            websocket.close();
        };
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (ws && message.trim() !== "") {
            ws.send(
                JSON.stringify({
                    type: "message",
                    payload: message,
                    clientId: clientId,
                    firstName: User.firstName,
                    lastName: User.lastName
                })
            );
            setMessage("");
            fetchMessages();
        }
    };

    const handleInputChange = (event) => {
        const userInput = event.target.value;
        // console.log("User input:", userInput);  Log the user input
        setMessage(userInput);
    };

    // Render only if clientId is initialized
    if (!clientId) {
        return null; // Or any loading indicator
    }

    if (!localUser || !localUser.courses || localUser.courses.length === 0) {
        return (
            <div className="text-3xl text-richblack-50 p-2 text-center mt-[35%]">
                To access chat features, kindly enroll in a course.
            </div>
        );
    }

    function formattedTime(timestamp) {
        const date = new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)
        const formattedTime = hours + ":" + (minutes < 10 ? "0" : "") + minutes + " " + ampm;
        return formattedTime;
    }

    const formattedDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const User = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="mx-auto w-[80%] ">
            <div className="text-3xl text-richblack-50 pb-2">Discussions</div>
            <div
                style={{ height: "70vh", width: "40vw", display: "flex", flexDirection: "column" }}
            >
                <div className="bg-[#161d29]  h-[75vh] w-[98.8%] p-2 overflow-y-scroll text-richblack-50 ">
                    <ul >
                        {messages.map((m, index) => (
                            <li key={index} className="w-[70%] text-center mb-4 bg-[#000814] rounded-md m-1 p-[6px]">
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center mb-1 ">
                                        <div className="bg-[#161d29] p-2 rounded-full  text-lg">
                                            <p className="text-xs font-bold">{m.user?.firstName} {m.user?.lastName}</p>
                                        </div>
                                        <p className="text-xs font-normal text-richblack-50">
                                            {formattedDate(m.createdAt)} at {formattedTime(m.createdAt)}
                                        </p>
                                    </div>
                                    <p className="flex justify-start font-extralight text-base w-full bg-[#161d29] p-1.5 rounded-md ">{m.message}</p>
                                </div>
                            </li>
                        ))}
                        <div ref={messagesEndRef}></div>
                        {loading && (
                            <div className="flex justify-center mt-2">
                                <MoonLoader
                                    color="#36d7b7"
                                    loading={loading}
                                    size={50}
                                />
                            </div>
                        )}
                    </ul>
                </div>
            </div>
            <div className="relative flex items-start">
                <input
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    className="p-2 pr-16 w-[39.35vw] h-16 leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none bg-[#161d29] border-none"
                    placeholder="Type your message here..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />
                <button
                    onClick={sendMessage}
                    className="flex-shrink-0 mt-2 -ml-12 flex items-center justify-center w-12 h-12"
                >
                    <MdSend className="w-8 h-8" />
                </button>
            </div>

        </div>
    );
}
