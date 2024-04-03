import {AnyValue, CheckIfAliasedTablesAreReferenced, R, SQL_BOOL, Value} from "../Types";
import {DbSelect07OrderBy} from "./DbSelect07OrderBy";

export class DbSelect06Having<Result, Tables, UsedTables, LastType> extends DbSelect07OrderBy<Result, Tables, UsedTables, LastType> {

    public having<
        UsedTables2 extends string
    >(
        col: CheckIfAliasedTablesAreReferenced<Tables, R<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
    ): DbSelect07OrderBy<Result, Tables, UsedTables, LastType> {
        this.builder.having(col as AnyValue)
        return new DbSelect07OrderBy(this.builder)
    }

}
