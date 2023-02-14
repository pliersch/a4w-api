import { SocketGateway } from "@modules/socket/socket.gateway";
import { Module } from '@nestjs/common';

@Module({
  providers: [SocketGateway],
})
export class EventsModule {}
