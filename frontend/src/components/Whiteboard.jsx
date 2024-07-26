import React, { useEffect } from 'react';

const Whiteboard = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "http://zwibbler.com/zwibbler-demo.js";
        script.async = true;
        script.onload = () => {
            const ctx = window.Zwibbler.create("#whiteboard", {});
            const nameInput = document.querySelector("#name");

            document.querySelector("#share-button").addEventListener("click", () => {
                const name = ctx.createSharedSession();
                prompt("Join this session in another window", name);
                nameInput.value = name;
            });

            document.querySelector("#join-button").addEventListener("click", () => {
                const name = prompt("Please enter the session name");
                if (name) {
                    ctx.joinSharedSession(name);
                    nameInput.value = name;
                }
            });
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', maxWidth: '800px' }}>
            <div id="top" style={{ marginBottom: '10px', textAlign: 'center' }}>
                <button id="share-button" style={{ padding: '10px 20px', fontSize: '16px' }}>Share Whiteboard Now</button>
                <button id="join-button" style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>Join shared session</button>
                <input id="name" readOnly style={{ marginLeft: '10px', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div id="whiteboard" style={{
                width: '100%',
                height: '500px', // Adjust the height as needed
                border: '1px solid #ccc',
                position: 'relative',
                backgroundColor: '#fff'
            }}></div>
        </div>
    );
};

export default Whiteboard;