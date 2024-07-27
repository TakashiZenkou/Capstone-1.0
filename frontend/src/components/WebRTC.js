import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useSocket } from '../SocketContext'; // Adjust the import path if necessary

const WebRTCComponent = forwardRef(({ roomId }, ref) => {
    const socket = useSocket();
    const [localStream, setLocalStream] = useState(null);
    const [peerConnections, setPeerConnections] = useState({});
    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef({});

    useImperativeHandle(ref, () => ({
        startCall: () => {
            // Notify other peers that we're starting a call
            socket.emit('joinRoom', { roomId });
        }
    }));

    useEffect(() => {
        if (!socket) return;

        // Function to handle incoming offer
        const handleOffer = async (offer, peerId) => {
            const peerConnection = new RTCPeerConnection();
            peerConnections[peerId] = peerConnection;
            setPeerConnections({ ...peerConnections });

            // Add local stream tracks to peer connection
            if (localStream) {
                localStream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, localStream);
                });
            }

            // Handle ice candidates
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('iceCandidate', { candidate: event.candidate, peerId, roomId });
                }
            };

            // Set remote description and create an answer
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit('answer', { answer, peerId, roomId });

            // Add remote stream to the remote video element
            peerConnection.ontrack = (event) => {
                if (!remoteVideoRefs.current[peerId]) {
                    remoteVideoRefs.current[peerId] = document.createElement('video');
                    remoteVideoRefs.current[peerId].autoplay = true;
                    remoteVideoRefs.current[peerId].playsInline = true;
                    document.getElementById('remote-videos').appendChild(remoteVideoRefs.current[peerId]);
                }
                remoteVideoRefs.current[peerId].srcObject = event.streams[0];
            };
        };

        // Function to handle incoming answer
        const handleAnswer = async (answer, peerId) => {
            const peerConnection = peerConnections[peerId];
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        };

        // Function to handle incoming ICE candidates
        const handleIceCandidate = (candidate, peerId) => {
            const peerConnection = peerConnections[peerId];
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        };

        // Event listeners for socket
        socket.on('offer', handleOffer);
        socket.on('answer', handleAnswer);
        socket.on('iceCandidate', handleIceCandidate);

        // Cleanup function
        return () => {
            socket.off('offer', handleOffer);
            socket.off('answer', handleAnswer);
            socket.off('iceCandidate', handleIceCandidate);

            // Close all peer connections
            Object.values(peerConnections).forEach(pc => {
                pc.close();
            });

            // Stop all local video tracks
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [socket, roomId, localStream, peerConnections]);

    useEffect(() => {
        const startLocalStream = async () => {
            try {
                const constraints = { audio: true };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                setLocalStream(stream);
    
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
    
                // Notify other peers that we are joining the room
                socket.emit('joinRoom', { roomId });
                socket.on('newPeer', (peerId) => {
                    // Handle new peer joining the room
                    const peerConnection = new RTCPeerConnection();
                    peerConnections[peerId] = peerConnection;
                    setPeerConnections({ ...peerConnections });
    
                    // Add local stream tracks to peer connection
                    stream.getTracks().forEach(track => {
                        peerConnection.addTrack(track, stream);
                    });
    
                    // Handle ice candidates
                    peerConnection.onicecandidate = (event) => {
                        if (event.candidate) {
                            socket.emit('iceCandidate', { candidate: event.candidate, peerId, roomId });
                        }
                    };
    
                    // Create and send offer
                    peerConnection.createOffer().then(async (offer) => {
                        await peerConnection.setLocalDescription(offer);
                        socket.emit('offer', { offer, peerId, roomId });
                    });
    
                    // Handle remote tracks
                    peerConnection.ontrack = (event) => {
                        if (!remoteVideoRefs.current[peerId]) {
                            remoteVideoRefs.current[peerId] = document.createElement('video');
                            remoteVideoRefs.current[peerId].autoplay = true;
                            remoteVideoRefs.current[peerId].playsInline = true;
                            document.getElementById('remote-videos').appendChild(remoteVideoRefs.current[peerId]);
                        }
                        remoteVideoRefs.current[peerId].srcObject = event.streams[0];
                    };
                });
            } catch (err) {
                console.error('Error accessing media devices:', err);
                alert('Error accessing media devices. Please check your camera and microphone settings.');
            }
        };
    
        startLocalStream();
    }, [socket, roomId]);

    return (
        <div className="webrtc-container">
            <div className="local-video-container">
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: 'auto' }}
                />
            </div>
            <div id="remote-videos" className="remote-videos-container">
                {/* Remote videos will be added here dynamically */}
            </div>
        </div>
    );
});

export default WebRTCComponent;