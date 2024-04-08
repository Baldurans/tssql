import {AliasedTable, Key, NotUsingWithPart, OrderByStructure} from "../../Types";
import {S6Limit} from "./S6Limit";
import {isColumnOkToUse} from "./S3GroupBy";
import {Expr, SqlExpression} from "../../SqlExpression";

export class S5OrderBy<Result, Tables, CTX> extends S6Limit<Result, CTX> {

    public orderBy<
        TableRef,
        Columns extends OrderByStructure<Expr<TableRef, string | unknown, any>>
    >(
        ...items: isColumnOkToUse<Tables, Columns>
    ): S6Limit<Result, CTX> {
        this.builder.orderBy(items as any);
        return new S6Limit(this.builder);
    }

    public orderByF<
        TableRef,
        Columns extends OrderByStructure<Expr<TableRef, string | unknown, string | number>>
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): S6Limit<Result, CTX> {
        const proxy: any = new Proxy({}, {
            get(target: {}, p: string, receiver: any): any {
                return new SqlExpression(p, p)
            }
        })
        this.builder.orderBy(func(proxy) as any);
        return new S6Limit(this.builder)
    }
}
