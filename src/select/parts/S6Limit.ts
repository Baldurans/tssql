import {SelectBuilder} from "../SelectBuilder";
import {ExecMethods, getExecMethods} from "./S7Exec";

export function getLimitMethods<Result>(builder: SelectBuilder): LimitMethods<Result> {
    return {
        noLimit: () => {
            return getExecMethods(builder)
        },
        limit: (limit: number | [number, number]): ExecMethods<Result> => {
            builder.limit(limit);
            return getExecMethods(builder);
        },
        limit1: () => {
            builder.limit(1);
            return getExecMethods(builder);
        }
    }
}

export interface LimitMethods<Result> {
    noLimit(): ExecMethods<Result>

    limit(limit: number | [number, number]): ExecMethods<Result>

    limit1(): ExecMethods<Result>
}
