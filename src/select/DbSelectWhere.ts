import {CheckIfAliasedTablesAreReferenced, R, SQL_BOOL, Value} from "../Types";
import {DbSelect} from "./DbSelect";
import {DbSelectGroupBy} from "./DbSelectGroupBy";

export class DbSelectWhere<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType> extends DbSelect {

    public whereAccessFullTable(): DbSelectGroupBy<Result,  Tables, UsedTables, LastType> {
        return new DbSelectGroupBy(this.db, this.parts)
    }

    public where<
        UsedTables2 extends string
    >(
        col: CheckIfAliasedTablesAreReferenced<Tables, R<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
    ): DbSelectWhere2<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType> {
        if (typeof col === "string") { // This is pretty much to satisfy typescript issue, not really needed for practical purposes.
            throw new Error("Invalid argument! Got '" + typeof col + "'")
        }
        if (col !== undefined) {
            this.parts._where.push(col.toString())
        }
        return new DbSelectWhere2(this.db, this.parts)
    }

}

export class DbSelectWhere2<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType> extends DbSelectGroupBy<Result, Tables, UsedTables, LastType> {

    public where<
        UsedTables2 extends string
    >(
        col: CheckIfAliasedTablesAreReferenced<Tables, R<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
    ): DbSelectWhere2<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType> {
        if (typeof col === "string") { // This is pretty much to satisfy typescript issue, not really needed for practical purposes.
            throw new Error("Invalid argument! Got '" + typeof col + "'")
        }
        if (col !== undefined) {
            this.parts._where.push(col.toString())
        }
        return new DbSelectWhere2(this.db, this.parts)
    }

}