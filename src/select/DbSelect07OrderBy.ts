import {AliasedTable, Key, NotUsingWithPart, OrderByStructure} from "../Types";
import {DbSelect08Limit} from "./DbSelect08Limit";
import {isColumnOkToUse} from "./DbSelect05GroupBy";
import {Expr, SqlExpression} from "../SqlExpression";

export class DbSelect07OrderBy<Result, Tables, CTX> extends DbSelect08Limit<Result, CTX> {

    public orderBy<
        TableRef,
        Columns extends OrderByStructure<Expr<TableRef, string | unknown, any>>
    >(
        ...items: isColumnOkToUse<Tables, Columns>
    ): DbSelect08Limit<Result, CTX> {
        this.builder.orderBy(items as any);
        return new DbSelect08Limit(this.builder);
    }

    public orderByF<
        TableRef,
        Columns extends OrderByStructure<Expr<TableRef, string | unknown, string | number>>
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): DbSelect08Limit<Result, CTX> {
        const proxy: any = new Proxy({}, {
            get(target: {}, p: string, receiver: any): any {
                return new SqlExpression(p, p)
            }
        })
        this.builder.orderBy(func(proxy) as any);
        return new DbSelect08Limit(this.builder)
    }
}
