import {vDateTime} from "../../src/CustomTypes";


export type tUserId = number & { tUserId: true };

export interface User {
    id: tUserId;
    name: string;
    age: number;
    isMan: number;
    created: vDateTime
}
