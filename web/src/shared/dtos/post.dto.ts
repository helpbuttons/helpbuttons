import { Column } from "typeorm";

export class MessageDto {
    @Column({})
    message: string;
}