import React, { useEffect, useRef } from 'react';

const Test = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const pc = useRef(new RTCPeerConnection(null))
    const textRef = useRef()


    const handleCreateOffer = () => {
        pc.current.createOffer().then(sdp =>{
            console.log(JSON.stringify(sdp))
            pc.current.setLocalDescription(sdp)
        }).catch(e => console.log(e))

    };

    const handleCreateAnswer = () => {
        pc.current.createAnswer().then(sdp =>{
            console.log(JSON.stringify(sdp))
            pc.current.setLocalDescription(sdp)
        }).catch(e => console.log(e))

    };

    const handleSetRemoteDescription = () => {
        const sdp = JSON.parse(textRef.current.value )
        console.log(sdp)
        pc.current.setRemoteDescription(new RTCSessionDescription(sdp))
    };

    const handleAddCandidates = () => {
        const candidate = JSON.parse(textRef.current.value )
        console.log('Adding Candidates...', candidate)
        pc.current.addIceCandidate(new RTCIceCandidate(candidate)
        )
    };

    useEffect(() =>{
        const handleGetScreenshareFeed = async () => {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                });
    
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            }catch(error){
                console.log(error);
            }
    
        }

        handleGetScreenshareFeed();

        const _pc = new RTCPeerConnection();
        _pc.onicecandidate = (e) =>{
            if (e.candidate)
                console.log(JSON.stringify(e.candidate))
        }

        _pc.oniceconnectionstatechange = (e) => {
            console.log(e);
        }

        _pc.ontrack = (e) => {

        }

        pc.current = _pc;
    }, [])

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <video ref={localVideoRef} width="400" height="400" style={{ border: '1px solid black' }} autoPlay playsInline></video>
                <video ref={remoteVideoRef} width="400" height="400" style={{ border: '1px solid black' }} autoPlay playsInline></video>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <button onClick={handleCreateOffer}>Create Offer</button>
                <button onClick={handleCreateAnswer}>Create Answer</button>
            </div>

            <textarea  ref={textRef}
                placeholder="Paste SDP or ICE candidates here..." 
                style={{ width: '100%', height: '100px', resize: 'vertical', marginBottom: '10px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <button onClick={handleSetRemoteDescription}>Set Remote Description</button>
                <button onClick={handleAddCandidates}>Add Candidates</button>
            </div>
        </div>
        );
    };


export default Test;