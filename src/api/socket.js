import { Client } from "@stomp/stompjs";

if (typeof window !== "undefined" && !window.global) {
  window.global = window;
}

let stompClient = null;
let connectingPromise = null;

export const connectSocket = async (onConnected) => {
  const SockJS = (await import("sockjs-client")).default;

  if (stompClient?.connected) {
    if (onConnected) onConnected(stompClient);
    return stompClient;
  }

  if (connectingPromise) {
    const client = await connectingPromise;
    if (onConnected) onConnected(client);
    return client;
  }

  connectingPromise = new Promise((resolve, reject) => {
    stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_API_URL.replace("/api", "")}/ws`),

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("STOMP connected");
        resolve(stompClient);

        if (onConnected) {
          onConnected(stompClient);
        }
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        reject(frame);
      },

      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
      },
    });

    stompClient.activate();
  });

  const client = await connectingPromise;
  connectingPromise = null;

  return client;
};

export const getSocket = () => stompClient;

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    connectingPromise = null;
  }
};