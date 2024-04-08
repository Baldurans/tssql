import {AliasedTable, Key, NotUsingWithPart, SQL_BOOL} from "../../Types";
import {S5OrderBy} from "./S5OrderBy";
import {isColumnOkToUse} from "./S3GroupBy";
import {AnyExpr, Expr, SqlExpression} from "../../SqlExpression";

export class S4Having<Result, Tables> extends S5OrderBy<Result, Tables> {

    public having<
        TableRef,
        Columns extends (Expr<TableRef, string | unknown, SQL_BOOL>)[]
    >(
        ...col: isColumnOkToUse<Tables, Columns>
    ): S5OrderBy<Result, Tables> {
        this.builder.having(col as unknown as AnyExpr[])
        return new S5OrderBy(this.builder)
    }

    public havingF<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, SQL_BOOL>[]
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): S5OrderBy<Result, Tables> {
        const proxy: any = new Proxy({}, {
            get(target: {}, p: string, receiver: any): any {
                return new SqlExpression(p, p)
            }
        })
        this.builder.having(func(proxy) as any);
        return new S5OrderBy(this.builder)
    }

}
