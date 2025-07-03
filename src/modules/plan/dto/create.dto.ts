import { IsBoolean, IsInt, IsJSON, IsString } from "class-validator";

export class PlanDto {

    @IsString()
    name: string

    @IsInt()
    price: number

    @IsInt()
    durationDays: number

    @IsJSON()
    features: []

    @IsBoolean()
    isActive: boolean
}
