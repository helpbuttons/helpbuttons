import { MinLength } from "class-validator";
import { Column } from "typeorm";

export class MessageDto {
    @Column({})
    @MinLength(6)
    message: string;
}