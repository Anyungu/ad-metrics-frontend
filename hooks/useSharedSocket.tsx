import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

const internalBrokerUrl = "127.0.0.1:4000";

const useSharedSocket = () => {
  useEffect(() => {
    console.log("Initializing Socket.IO client...");
    const socket: Socket = io(internalBrokerUrl);

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO connection closed");
    });

    return () => {
      if (socket?.connected) {
        socket.disconnect();
        console.log("Socket.IO client disconnected");
      }
    };
  }, []);
};

export default useSharedSocket;
