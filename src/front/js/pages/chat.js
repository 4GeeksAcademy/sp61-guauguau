import React, { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { Context } from '../store/appContext';

const socket = io(process.env.BACKEND_URL);

export const Chat = () => {
    const { matchId } = useParams();
    const { store } = useContext(Context);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        socket.emit('joinRoom', { match_id: matchId });

        const fetchMessages = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/messages/${matchId}`, {
                    headers: {
                        'Authorization': `Bearer ${store.token}`
                    }
                });

                if (response.status === 401) {
                    throw new Error("Unauthorized");
                }

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || "Error fetching messages");
                }

                const data = await response.json();
                setMessages(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setMessages([]);
            }
        };
        fetchMessages();

        socket.on('new_message', message => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            socket.emit('leaveRoom', { match_id: matchId });
            socket.off();
        };
    }, [matchId, store.token]);

    const sendMessage = async () => {
        const messageData = {
            match_id: matchId,
            sender_pet_id: store.currentPetId,
            content: newMessage
        };

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${store.token}`
                },
                body: JSON.stringify(messageData)
            });

            if (response.status === 401) {
                throw new Error("Unauthorized");
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Error sending message");
            }

            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="chat-container">
            <h2>Chat</h2>
            <div className="messages-container">
                {messages.map((msg, index) => {
                    const isSent = msg.sender_pet_id === store.currentPetId;
                    const pet = store.pets.find(p => p.id === msg.sender_pet_id);
                    return (
                        <div 
                            key={index} 
                            className={`message ${isSent ? 'sent' : 'received'}`}
                        >
                            <div className="message-info">
                                <img src={pet.profile_photo_url} alt={pet.name} className="pet-avatar" />
                                <div className="message-details">
                                    <span className="pet-name">{pet.name}</span>
                                    <span className="message-content">{msg.content}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="input-container">
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};
