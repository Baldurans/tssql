import {AliasedTable, Key, NotUsingWithPart} from "../../Types";
import {getHavingMethods, HavingMethods} from "./S4Having";
import {Expr, SqlExpression} from "../../SqlExpression";
import {getOrderByMethods, OrderByMethods} from "./S5OrderBy";
import {getLimitMethods, LimitMethods} from "./S6Limit";
import {SelectBuilder} from "../SelectBuilder";

export function getGroupByMethods<Result, Tables>(builder: SelectBuilder): GroupByMethods<Result, Tables> {
    return {
        groupBy: (...items: any) => {
            builder.groupBy(items as any);
            return getHavingMethods(builder)
        },
        groupByF: (func: any) => {
            const proxy: any = new Proxy({}, {
                get(target: {}, p: string, receiver: any): any {
                    return new SqlExpression(p, p)
                }
            })
            builder.groupBy(func(proxy) as any);
            return getHavingMethods(builder)
        },

        ...getOrderByMethods(builder),
        ...getLimitMethods(builder)
    }
}

export interface GroupByMethods<Result, Tables> extends OrderByMethods<Result, Tables>, LimitMethods<Result> {
    groupBy<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, any>[]
    >(
        ...items: isColumnOkToUse<Tables, Columns>
    ): HavingMethods<Result, Tables>

    groupByF<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, any>[]
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): HavingMethods<Result, Tables>
}


type _getMissing<Tables, Check> = Check extends keyof Tables ? never : Check;

type _checkThatTableOrColumnCanBeReferenced<Tables, Expr> =
    Expr extends { tableRef: string } ?
        Expr["tableRef"] extends keyof Tables ?
            Expr
            : `Table '${_getMissing<Tables, Expr["tableRef"]>}' is not used in this query!`
        : Expr

export type isColumnOkToUse<Tables, ColumnExpressions> =
    ColumnExpressions extends []
        ? ColumnExpressions
        : ColumnExpressions extends [infer A, ...(infer Rest)]
            ? [_checkThatTableOrColumnCanBeReferenced<Tables, A>, ...isColumnOkToUse<Tables, Rest>]
            : ColumnExpressions;

