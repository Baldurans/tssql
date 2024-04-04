import {AnyExpr, isTableReferenced, Key, SQL_BOOL, Expr} from "../Types";
import {DbSelect07OrderBy} from "./DbSelect07OrderBy";

export class DbSelect06Having<Result, Tables, CTX> extends DbSelect07OrderBy<Result, Tables, CTX> {

    public having<
        UsedTables2 extends string
    >(
        col: isTableReferenced<Tables, Key<UsedTables2>, Expr<UsedTables2, unknown, SQL_BOOL>>
    ): DbSelect07OrderBy<Result, Tables, CTX> {
        this.builder.having(col as unknown as AnyExpr)
        return new DbSelect07OrderBy(this.builder)
    }

}
