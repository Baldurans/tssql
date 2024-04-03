import {DbSelect} from "./DbSelect";
import {DbSelect09Exec} from "./DbSelect09Exec";

export class DbSelect08Limit<Result, UsedTables, LastType> extends DbSelect {

    public noLimit(): DbSelect09Exec<Result, UsedTables, LastType> {
        return new DbSelect09Exec( this.parts);
    }

    public limit(limit: number | [number, number]): DbSelect09Exec<Result, UsedTables, LastType> {
        if (Array.isArray(limit)) {
            this.parts._limit = Number(limit[0]) + "," + Number(limit[1]);
        } else {
            this.parts._limit = String(Number(limit));
        }
        return new DbSelect09Exec(this.parts);
    }

}
