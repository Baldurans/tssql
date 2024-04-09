import {AliasedTable, Key, NotUsingWithPart, OrderByStructure} from "../../Types";
import {constructLimit, Limit} from "./S6Limit";
import {isColumnOkToUse} from "./S3GroupBy";
import {Expr, SqlExpression} from "../../SqlExpression";
import {SelectBuilder} from "../SelectBuilder";

export function constructOrderBy<Result, Tables>(builder: SelectBuilder): OrderBy<Result, Tables> {
    return {
        orderBy: (...items: any) => {
            builder.orderBy(items as any);
            return constructLimit(builder)
        },
        orderByF: (func: any) => {
            const proxy: any = new Proxy({}, {
                get(target: {}, p: string, receiver: any): any {
                    return new SqlExpression(p, p)
                }
            })
            builder.orderBy(func(proxy) as any);
            return constructLimit(builder)
        }
    }
}

export interface OrderBy<Result, Tables> {
    orderBy<
        TableRef,
        Columns extends OrderByStructure<Expr<TableRef, string | unknown, any>>
    >(
        ...items: isColumnOkToUse<Tables, Columns>
    ): Limit<Result>

    orderByF<
        TableRef,
        Columns extends OrderByStructure<Expr<TableRef, string | unknown, string | number>>
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): Limit<Result>

}
