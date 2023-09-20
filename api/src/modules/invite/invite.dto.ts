import { IsBoolean, IsNumber } from "class-validator";

export class InviteCreateDto {

    @IsNumber()
    maximumUsage: number;

    @IsNumber()
    expirationTimeInSeconds: number;

    @IsBoolean()
    followMe: boolean;
}