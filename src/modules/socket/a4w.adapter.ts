import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from "socket.io";

export class A4WAdapter extends IoAdapter {
  // private readonly authService:AuthService;
  constructor(private app: INestApplicationContext) {
    super(app);
    // this.authService = this.app.get(AuthService);
  }

  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, options);

    // server.use(async (socket: any, next) => {
    //   console.log('A4WAdapter YYYYYYYYYYY: ',)
    //   const tokenPayload: string = socket.handshake?.auth?.token;
    //
    //   try {
    //     socket.user = {};
    //     // const user = await this.authService.authenticateToken(token);
    //     // socket.user = user;
    //     return next();
    //   } catch (error: any) {
    //     console.log('A4WAdapter : ', error)
    //     return next(new Error('Authentication error'));
    //   }
    // });
    return server;
  }
}
