import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'scan',
  cors: {
    origin: '*',
  },
})
export class ScanGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('scan.connected', {
      socketId: client.id,
    });
  }

  @SubscribeMessage('scan.join_user')
  handleJoinUser(
    @MessageBody() payload: { userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`user:${payload.userId}`);

    client.emit('scan.joined_user', {
      userId: payload.userId,
    });
  }

  emitPriceTick(userId: number, payload: unknown) {
    this.server.to(`user:${userId}`).emit('scan.price_tick', payload);
  }

  emitLiveResult(userId: number, payload: unknown) {
    this.server.to(`user:${userId}`).emit('scan.live_result', payload);
  }

  emitSignalTriggered(userId: number, payload: unknown) {
    this.server.to(`user:${userId}`).emit('scan.signal_triggered', payload);
  }
}
