import {AnyExpr, Expr, isTableReferenced, SQL_BOOL} from "../Types";
import {DbSelect07OrderBy} from "./DbSelect07OrderBy";

export class DbSelect06Having<Result, Tables, CTX> extends DbSelect07OrderBy<Result, Tables, CTX> {

    public having<
        TableRef extends string
    >(
        col: isTableReferenced<Tables, TableRef, Expr<TableRef, unknown, SQL_BOOL>>
    ): DbSelect07OrderBy<Result, Tables, CTX> {
        this.builder.having(col as unknown as AnyExpr)
        return new DbSelect07OrderBy(this.builder)
    }

}
