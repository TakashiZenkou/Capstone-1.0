import React, { useEffect } from 'react';

const Whiteboard = () => {
    useEffect(() => {
        let scriptLoaded = false;

        const handleShareClick = (ctx, nameInput) => {
            const name = ctx.createSharedSession();
            prompt("Join this session in another window", name);
            nameInput.value = name;
        };

        const handleJoinClick = (ctx, nameInput) => {
            const name = prompt("Please enter the session name");
            if (name) {
                ctx.joinSharedSession(name);
                nameInput.value = name;
            }
        };

        const loadScript = () => {
            if (scriptLoaded) return;

            scriptLoaded = true;
            const script = document.createElement("script");
            script.src = "http://zwibbler.com/zwibbler-demo.js";
            script.async = true;
            script.onload = () => {
                // Initialize Zwibbler
                const ctx = window.Zwibbler.create("#whiteboard", {});
                const nameInput = document.querySelector("#name");

                if (!document.querySelector("#share-button") || !document.querySelector("#join-button")) {
                    console.error("Share or Join button not found.");
                    return;
                }

                // Remove old event listeners if they exist
                document.querySelector("#share-button").removeEventListener("click", () => handleShareClick(ctx, nameInput));
                document.querySelector("#join-button").removeEventListener("click", () => handleJoinClick(ctx, nameInput));

                // Add new event listeners
                document.querySelector("#share-button").addEventListener("click", () => handleShareClick(ctx, nameInput));
                document.querySelector("#join-button").addEventListener("click", () => handleJoinClick(ctx, nameInput));
            };

            document.body.appendChild(script);
        };

        loadScript();

        return () => {
            const existingScript = document.querySelector("script[src='http://zwibbler.com/zwibbler-demo.js']");
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
            scriptLoaded = false;
        };
    }, []);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', maxWidth: '800px', zIndex: 2 }}>
            <div id="top" style={{ marginBottom: '10px', textAlign: 'center', zIndex: 3 }}>
                <button id="share-button" style={{ padding: '10px 20px', fontSize: '16px' }}>Share Whiteboard Now</button>
                <button id="join-button" style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>Join shared session</button>
                <input id="name" readOnly style={{ marginLeft: '10px', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div id="whiteboard" style={{
                width: '100%',
                height: '500px',
                border: '1px solid #ccc',
                position: 'relative',
                backgroundColor: '#fff'
            }}></div>
        </div>
    );
};

export default Whiteboard;