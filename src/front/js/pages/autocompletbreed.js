import React, { useContext, useState } from 'react';
import { Context } from '../store/appContext';

export const Autocomplete = ({ onSelect }) => {
    const { store } = useContext(Context);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 1) {
            const filteredSuggestions = store.raza.filter(raza =>
                raza.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    
    const handleSelect = (raza) => {
        setQuery(raza.name);
        setSuggestions([]);
        onSelect(raza);
    };
    

    return (
        <>
        <div>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Busca una raza..."
            />
            <ul>
                {suggestions.map((raza) => (
                    <li key={raza.id} onClick={() => handleSelect(raza)}>
                        {raza.name}
                    </li>
                ))}
            </ul>
           
        </div>
        
       
    </>
    );
};


