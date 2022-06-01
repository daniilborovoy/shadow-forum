import { createContext, ReactNode } from 'react';
import { Socket } from 'socket.io-client';

export const WebSocket = createContext<Socket | null>(null);

export const WebSocketProvider = ({
  children,
  socket,
}: {
  children: ReactNode;
  socket: Socket | null;
}) => <WebSocket.Provider value={socket}>{children}</WebSocket.Provider>;
