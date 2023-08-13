import { Visit } from "@modules/admin/visits/entities/visit.entity";
import { PartialType } from "@nestjs/mapped-types";

export class CreateVisitDto extends PartialType(Visit) {}
