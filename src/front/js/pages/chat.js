import React, { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { Context } from '../store/appContext';

const socket = io(process.env.BACKEND_URL);

export const Chat = () => {
    const { petId1, petId2 } = useParams();
    const { store } = useContext(Context);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        socket.emit('joinRoom', { petId1, petId2 });

        socket.on('message', message => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            socket.emit('leaveRoom', { petId1, petId2 });
            socket.off();
        };
    }, [petId1, petId2]);

    const sendMessage = () => {
        socket.emit('sendMessage', { petId1, petId2, message: newMessage });
        setNewMessage("");
    };

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
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

export default Chat;
