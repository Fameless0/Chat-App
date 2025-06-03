import { useEffect, useRef } from "react";
import Socket from "../Socket";

export default function VideoCall({ to }) {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const pc = useRef(null);

  useEffect(() => {
    const handleOffer = async ({ offer, from }) => {
      pc.current = createPeerConnection(from);
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      Socket.emit("answer", { answer, to: from });
    };

    const handleAnswer = ({ answer }) => {
      pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleCandidate = ({ candidate }) => {
      pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
    };

    Socket.on("offer", handleOffer);
    Socket.on("answer", handleAnswer);
    Socket.on("ice-candidate", handleCandidate);

    return () => {
      Socket.off("offer", handleOffer);
      Socket.off("answer", handleAnswer);
      Socket.off("ice-candidate", handleCandidate);
    };
  }, []);

  const createPeerConnection = (targetId) => {
    const peer = new RTCPeerConnection();

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        Socket.emit("ice-candidate", { candidate: event.candidate, to: targetId });
      }
    };

    peer.ontrack = (e) => {
      remoteVideo.current.srcObject = e.streams[0];
    };

    return peer;
  };

  const callUser = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.current.srcObject = stream;

    pc.current = createPeerConnection(to);
    stream.getTracks().forEach(track => {
      pc.current.addTrack(track, stream);
    });

    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    Socket.emit("offer", { offer, to });
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-semibold mb-2">Video Call</h2>
      <div className="flex gap-2 mb-2">
        <video ref={localVideo} autoPlay muted className="w-48 h-36 rounded bg-black" />
        <video ref={remoteVideo} autoPlay className="w-48 h-36 rounded bg-black" />
      </div>
      <button
        onClick={callUser}
        disabled={!to}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        Call {to ? 'User' : '(select a user)'}
      </button>
    </div>
  );
}
