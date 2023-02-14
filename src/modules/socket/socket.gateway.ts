import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() client: any) {
    console.log('SocketGateway handleConnection: ')
    // console.log(
    //   `user ${client.user.id} with socket ${client.id} connected with device ${client.handshake?.query?.deviceId}`,
    // );

    //   client.join(
    //     getUserDeviceRoom(
    //       client.user.id,
    //       client.handshake.query.deviceId.toString(),
    //     ),
    //   );
  }

  handleDisconnect(@ConnectedSocket() client: any) {
    console.log('SocketGateway handleDisconnect: ')
    // console.log(
    //   `user ${client.user.id} with socket ${client.id} with device ${client.handshake?.query?.deviceId} DISCONNECTED`,
    // );

    // client.leave(
    //   getUserDeviceRoom(
    //     client.user.id,
    //     client.handshake.query.deviceId.toString(),
    //   ),
    // );
  }

  afterInit(server: any): any {
    console.log('SocketGateway afterInit: ZZZZZZZZZZZZZ')
  }

  // @SubscribeMessage(TimerEvents.timerStart.toString())
  // startMyTimer(@ConnectedSocket() client: any, @MessageBody() body: any): void {
  //   // Stop any existing timer for this user device.
  //   stopTimerForUserDevice(
  //     client.user.id,
  //     client.handshake.query.deviceId.toString(),
  //   );
  //
  //   // Start a new timer for this user device.
  //   startTimerForUserDevice(
  //     this.server,
  //     client.user.id,
  //     client.handshake.query.deviceId.toString(),
  //     body.dur, // Timer duration
  //   );
  // }
  //
  // @SubscribeMessage(TimerEvents.timerStop.toString())
  // stopMyTimer(@ConnectedSocket() client: any): void {
  //   // Stop current timer for this user device.
  //   stopTimerForUserDevice(
  //     client.user.id,
  //     client.handshake.query.deviceId.toString(),
  //   );
  // }

  @SubscribeMessage('chat-message')
  chatMessage(@MessageBody() data: any): void/*Observable<WsResponse<number>>*/ {
    console.log('SocketGateway findAll: ', data)
    // return from([1, 2, 3]).pipe(map(item => ({event: 'events', data: item})));
  }

  //
  // @SubscribeMessage('identity')
  // async identity(@MessageBody() data: number): Promise<number> {
  //   return data;
  // }
}
