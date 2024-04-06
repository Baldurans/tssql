import {AliasedTable, AnyExpr, Expr, Key, NotUsingWithPart, SQL_BOOL} from "../Types";
import {DbSelect07OrderBy} from "./DbSelect07OrderBy";
import {isColumnOkToUse} from "./DbSelect05GroupBy";
import {SqlExpression} from "../SqlExpression";

export class DbSelect06Having<Result, Tables, CTX> extends DbSelect07OrderBy<Result, Tables, CTX> {

    public having<
        TableRef extends string,
        Columns extends (Expr<TableRef, string | unknown, SQL_BOOL, string | unknown>)[]
    >(
        ...col: isColumnOkToUse<Result, Tables, Columns>
    ): DbSelect07OrderBy<Result, Tables, CTX> {
        this.builder.having(col as unknown as AnyExpr[])
        return new DbSelect07OrderBy(this.builder)
    }

    public havingF<
        TableRef extends string,
        StrNames extends string | never,
        Columns extends Expr<TableRef, string | unknown, SQL_BOOL, StrNames>[]
    >(
        func: (columnsTable: AliasedTable<"__res", "__res", Result, NotUsingWithPart>) => isColumnOkToUse<Result, Tables & Key<"__res">, Columns>
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
