import {AliasedTable, COLUMNS, Key, NotUsingWithPart, SQL_BOOL} from "../Types";
import {DbSelect07OrderBy} from "./DbSelect07OrderBy";
import {isColumnOkToUse} from "./DbSelect05GroupBy";
import {AnyExpr, Expr, SqlExpression} from "../SqlExpression";

export class DbSelect06Having<Result, Tables, CTX> extends DbSelect07OrderBy<Result, Tables, CTX> {

    public having<
        TableRef,
        Columns extends (Expr<TableRef, string | unknown, SQL_BOOL>)[]
    >(
        ...col: isColumnOkToUse<Tables, Columns>
    ): DbSelect07OrderBy<Result, Tables, CTX> {
        this.builder.having(col as unknown as AnyExpr[])
        return new DbSelect07OrderBy(this.builder)
    }

    public havingF<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, SQL_BOOL>[]
    >(
        func: (columnsTable: AliasedTable<COLUMNS, COLUMNS, Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<COLUMNS>, Columns>
    ): DbSelect07OrderBy<Result, Tables, CTX> {
        const proxy: any = new Proxy({}, {
            get(target: {}, p: string, receiver: any): any {
                return new SqlExpression(p, p)
            }
        })
        this.builder.having(func(proxy) as any);
        return new DbSelect07OrderBy(this.builder)
    }

}
