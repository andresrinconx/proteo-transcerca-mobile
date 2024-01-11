import { LOCAL_API_URL, API_URL } from '@env';
import { Socket, io } from 'socket.io-client';

export const socket: Socket = io(LOCAL_API_URL);