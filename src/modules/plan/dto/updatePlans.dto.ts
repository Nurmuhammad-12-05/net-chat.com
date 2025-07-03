import { PartialType } from "@nestjs/mapped-types";
import { PlanDto } from "./create.dto";

export class updatePlan extends PartialType(PlanDto) {}