import { useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";

export const useReactQuerySubscription = () => {
  const queryClient = useQueryClient();
  const [webSocket, setWebsocket] = useState<WebSocket | null>(null);

  React.useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000/ws");
    socket.onopen = () => {
      console.log("connected");
    };
    socket.onmessage = (event) => {
      try {
        console.log(JSON.parse(event.data));
      } catch (e) {
        console.log(event.data);
      }

      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "schedule",
      });
    };

    setWebsocket(socket);

    return () => {
      if (socket) socket.close();
    };
  }, [queryClient]);

  return { webSocket: webSocket! };
};
