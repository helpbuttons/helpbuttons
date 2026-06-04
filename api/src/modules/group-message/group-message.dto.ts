import { GroupMessageType } from "@src/shared/types/group-message.enum";

export class GroupMessages{
    community: GroupMessageDtoOut;
    admin?: GroupMessageDtoOut;
}
export class GroupMessageDtoOut {
    id: string;
    createdAt: Date;
    // from: string;
    title: string; // from name
    message: string;
    // to: GroupMessageType;
    read: boolean;
}

// export class GroupMessageDtoIn {
//     id: string;
//     createdAt: Date;
//     // from: string;
//     title: string; // from name
//     message: string;
//     // to: GroupMessageType;
//     read: boolean;
// }