import {ExecMethods} from "./S7Exec";

export interface LimitMethods<Result, CTX> extends ExecMethods<Result, CTX> {
    noLimit(): ExecMethods<Result, CTX>

    limit(limit: number | [number, number]): ExecMethods<Result, CTX>

    limit1(): ExecMethods<Result, CTX>
}
