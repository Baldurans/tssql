import {AliasedTable, isColumnOkToUse, Key, NotUsingWithPart, OrderByStructure} from "../../Types";
import {getLimitMethods, LimitMethods} from "./S6Limit";
import {Expr, SqlExpression} from "../../SqlExpression";
import {SelectBuilder} from "../SelectBuilder";

export function getOrderByMethods<Result, Tables>(builder: SelectBuilder): OrderByMethods<Result, Tables> {
    return {
        orderBy: (...items: any) => {
            builder.orderBy(items as any);
            return getLimitMethods(builder)
        },
        orderByF: (func: any) => {
            const proxy: any = new Proxy({}, {
                get(target: {}, p: string, receiver: any): any {
                    return new SqlExpression(p, p)
                }
            })
            builder.orderBy(func(proxy) as any);
            return getLimitMethods(builder)
        },
        ...getLimitMethods(builder),
    }
}

export interface OrderByMethods<Result, Tables> extends LimitMethods<Result> {
    orderBy<
        TableRef,
        Columns extends OrderByStructure<Expr<TableRef, string | unknown, any>>
    >(
        ...items: isColumnOkToUse<Tables, Columns>
    ): LimitMethods<Result>

    orderByF<
        TableRef,
        Columns extends OrderByStructure<Expr<TableRef, string | unknown, string | number>>
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): LimitMethods<Result>

}
