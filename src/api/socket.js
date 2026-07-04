import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectSocket = (onConnected) => {
  if (stompClient?.connected) {
    if (onConnected) onConnected(stompClient);
    return stompClient;
  }

  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS(`${import.meta.env.VITE_API_URL.replace("/api", "")}/ws`),

    reconnectDelay: 5000,

    onConnect: () => {
      console.log("WebSocket connected");

      if (onConnected) {
        onConnected(stompClient);
      }
    },

    onStompError: (frame) => {
      console.error("STOMP error:", frame);
    },

    onWebSocketError: (error) => {
      console.error("WebSocket error:", error);
    },
  });

  stompClient.activate();

  return stompClient;
};

export const getSocket = () => {
  return stompClient;
};

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};