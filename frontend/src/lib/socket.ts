import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    socket.on('connect', () => {
      console.log('⚡ [AegisNet Socket] Connected to real-time telemetry stream:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.warn('⚠️ [AegisNet Socket] Disconnected from server');
    });
  }
  return socket;
}
