import { Visit } from "@modules/admin/visits/entities/visit.entity";
import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { VisitsController } from './visits.controller';
import { VisitsService } from './visits.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Visit])
  ],
  controllers: [VisitsController],
  providers: [VisitsService]
})
export class VisitsModule {}
