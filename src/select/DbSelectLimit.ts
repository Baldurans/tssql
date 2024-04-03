import {DbSelect} from "./DbSelect";
import {DbSelectExec} from "./DbSelectExec";

export class DbSelectLimit<Result, UsedTables, LastType> extends DbSelect {

    public noLimit(): DbSelectExec<Result, UsedTables, LastType> {
        return new DbSelectExec(this.db, this.parts);
    }

    public limit(limit: number | [number, number]): DbSelectExec<Result, UsedTables, LastType> {
        if (Array.isArray(limit)) {
            this.parts._limit = Number(limit[0]) + "," + Number(limit[1]);
        } else {
            this.parts._limit = String(Number(limit));
        }
        return new DbSelectExec(this.db, this.parts);
    }

}
