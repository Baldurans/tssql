import {vDateTime} from "../../src";


export type tUserId = number & { tUserId: true };

export interface User {
    id: tUserId;
    created_at: vDateTime,
    updated_at: vDateTime,
    username: string;
    age: number;
    isMan: number | null;
    created: vDateTime | null
    tin: number | null,
    uuid: string | null
}

export interface UserRowForEdit {
    username: unknown;
    age: unknown;
    isMan?: unknown;
    created?: unknown
    tin?: unknown
    uuid?: unknown
}