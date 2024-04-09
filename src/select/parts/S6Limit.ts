import {SelectQueryPart} from "../SelectQueryPart";
import {S7Exec} from "./S7Exec";
import {SelectBuilder} from "../SelectBuilder";

export class S6Limit<Result> extends SelectQueryPart {

    public noLimit(): S7Exec<Result> {
        return new S7Exec(this.builder);
    }

    public limit(limit: number | [number, number]): S7Exec<Result> {
        this.builder.limit(limit);
        return new S7Exec(this.builder);
    }

    public limit1(): S7Exec<Result> {
        return this.limit(1);
    }

}

export function constructLimit<Result>(builder: SelectBuilder): Limit<Result> {
    return {
        noLimit: () => {
            return new S7Exec(builder)
        },
        limit: (limit: number | [number, number]): S7Exec<Result> => {
            builder.limit(limit);
            return new S7Exec(builder);
        },
        limit1: () => {
            builder.limit(1);
            return new S7Exec(builder);
        }
    }
}


export interface Limit<Result> {
    noLimit(): S7Exec<Result>

    limit(limit: number | [number, number]): S7Exec<Result>

    limit1(): S7Exec<Result>
}
