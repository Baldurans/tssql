import {SelectQueryPart} from "../SelectQueryPart";
import {S7Exec} from "./S7Exec";

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
