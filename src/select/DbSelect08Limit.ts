import {DbSelect} from "./DbSelect";
import {DbSelect09Exec} from "./DbSelect09Exec";

export class DbSelect08Limit<Result, CTX> extends DbSelect<CTX> {

    public noLimit(): DbSelect09Exec<Result, CTX> {
        return new DbSelect09Exec(this.builder);
    }

    public limit(limit: number | [number, number]): DbSelect09Exec<Result, CTX> {
        this.builder.limit(limit);
        return new DbSelect09Exec(this.builder);
    }

    public limit1(): DbSelect09Exec<Result, CTX> {
        return this.limit(1);
    }

}
