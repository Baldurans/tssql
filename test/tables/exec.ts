import {S7Exec} from "../../src/select/parts/S7Exec";

export async function exec<Result>(query: S7Exec<Result>): Promise<Result[]> {
    return [{} as any];
}

export async function execOne<Result>(query: S7Exec<Result>): Promise<Result> {
    return {} as any;
}