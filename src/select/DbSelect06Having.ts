import {AnyValue, isTableReferenced, Key, SQL_BOOL, Value} from "../Types";
import {DbSelect07OrderBy} from "./DbSelect07OrderBy";

export class DbSelect06Having<Result, Tables, CTX> extends DbSelect07OrderBy<Result, Tables, CTX> {

    public having<
        UsedTables2 extends string
    >(
        col: isTableReferenced<Tables, Key<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
    ): DbSelect07OrderBy<Result, Tables, CTX> {
        this.builder.having(col as unknown as AnyValue)
        return new DbSelect07OrderBy(this.builder)
    }

}
