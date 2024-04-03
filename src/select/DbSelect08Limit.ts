import {DbSelect} from "./DbSelect";
import {DbSelect09Exec} from "./DbSelect09Exec";

export class DbSelect08Limit<Result, UsedTables, LastType> extends DbSelect {

    public noLimit(): DbSelect09Exec<Result, UsedTables, LastType> {
        return new DbSelect09Exec(this.builder);
    }

    public limit(limit: number | [number, number]): DbSelect09Exec<Result, UsedTables, LastType> {
        this.builder.limit(limit);
        return new DbSelect09Exec(this.builder);
    }

}
