import {AnyExpr, Expr} from "../Types";
import {DbSelect07OrderBy} from "./DbSelect07OrderBy";
import {_checkThatTableOrColumnCanBeReferenced} from "./DbSelect05GroupBy";

export class DbSelect06Having<Result, Tables, CTX> extends DbSelect07OrderBy<Result, Tables, CTX> {

    public having<TableRef extends string>(
        col: _checkThatTableOrColumnCanBeReferenced<Result, Tables, Expr<TableRef, unknown, any>>
    ): DbSelect07OrderBy<Result, Tables, CTX> {
        this.builder.having(col as unknown as AnyExpr)
        return new DbSelect07OrderBy(this.builder)
    }

}
