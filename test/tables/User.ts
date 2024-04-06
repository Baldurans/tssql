import {vDateTime} from "../../src";


export type tUserId = number & { tUserId: true };

export interface User {
    id: tUserId;
    username: string;
    age: number;
    isMan: number;
    created: vDateTime
    tin: number,
    created_at: vDateTime,
    updated_at: vDateTime,
    uuid: string
}
