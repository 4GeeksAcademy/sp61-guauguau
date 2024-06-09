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
        // Unirse a la sala de chat
        socket.emit('joinRoom', { match_id: matchId });

        // Cargar mensajes guardados desde el servidor
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

        // Escuchar nuevos mensajes desde el servidor
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
            sender_pet_id: store.currentPetId, // Asegúrate de usar sender_pet_id aquí
            content: newMessage
        };
        console.log("Sending message with:", messageData);

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

            const data = await response.json();
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg.content}</div>
                ))}
            </div>
            <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};
