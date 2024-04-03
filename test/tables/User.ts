import {vDateTime} from "../../src/CustomTypes";


export type tUserId = number & { tUserId: true };

export interface User {
    id: tUserId;
    username: string;
    age: number;
    isMan: number;
    created: vDateTime
}
