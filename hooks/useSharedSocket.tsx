import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const internalBrokerUrl = "127.0.0.1:8082";


const useSharedSocket = (
  initialData: MessageType[] = [],
  intialTotal: MessageType[] = []
) => {
  const [messages, setMessages] = useState<MessageType[]>(initialData || []);
  const [totalImpressions, setTotalImpressions] = useState<MessageType[]>(
    intialTotal || []
  );

  useEffect(() => {
    setMessages(initialData || []);
    setTotalImpressions(intialTotal || []);
  }, [initialData, intialTotal]);

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

    socket.on("impressions", (message: string) => {
      console.log("Received alert:", message);
      setMessages(JSON.parse(message));
    });

    socket.on("total_impressions", (message: string) => {
      console.log("Received alert totla:", message);
      setTotalImpressions([JSON.parse(message)]);
    });

    return () => {
      if (socket?.connected) {
        socket.disconnect();
        console.log("Socket.IO client disconnected");
      }
    };
  }, []);

  return [messages, totalImpressions];
};

export default useSharedSocket;
