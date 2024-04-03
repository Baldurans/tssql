import {CheckIfAliasedTablesAreReferenced, R, SQL_BOOL, Value} from "./Types";
import {DbSelectOrderBy} from "./DbSelectOrderBy";

export class DbSelectHaving<Result, Tables, UsedTables, LastType> extends DbSelectOrderBy<Result,  Tables, UsedTables, LastType> {

    public having<
        UsedTables2 extends string
    >(
        col: CheckIfAliasedTablesAreReferenced<Tables, R<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
    ): DbSelectOrderBy<Result, Tables, UsedTables, LastType> {
        if (typeof col === "string") { // This is pretty much to satisfy typescript issue, not really needed for practical purposes.
            throw new Error("Invalid argument! Got '" + typeof col + "'")
        }
        if (col !== undefined) {
            this.parts._having.push(col.toString())
        }
        return new DbSelectOrderBy(this.db, this.parts)
    }

}
