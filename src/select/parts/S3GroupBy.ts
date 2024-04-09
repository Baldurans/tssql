import {AliasedTable, Key, NotUsingWithPart} from "../../Types";
import {constructHaving, Having} from "./S4Having";
import {Expr, SqlExpression} from "../../SqlExpression";
import {constructOrderBy, OrderBy} from "./S5OrderBy";
import {constructLimit, Limit} from "./S6Limit";
import {SelectBuilder} from "../SelectBuilder";

export function constructGroupBy<Result, Tables>(builder: SelectBuilder): GroupBy<Result, Tables> {
    return {
        groupBy: (...items: any) => {
            builder.groupBy(items as any);
            return {
                ...constructHaving(builder),
                ...constructOrderBy(builder),
                ...constructLimit(builder)
            }
        },
        groupByF: (func: any) => {
            const proxy: any = new Proxy({}, {
                get(target: {}, p: string, receiver: any): any {
                    return new SqlExpression(p, p)
                }
            })
            builder.groupBy(func(proxy) as any);
            return {
                ...constructHaving(builder),
                ...constructOrderBy(builder),
                ...constructLimit(builder)
            }
        }
    }
}


export interface GroupBy<Result, Tables> {
    groupBy<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, any>[]
    >(
        ...items: isColumnOkToUse<Tables, Columns>
    ): Having<Result, Tables> & OrderBy<Result, Tables> & Limit<Result>

    groupByF<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, any>[]
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): Having<Result, Tables> & OrderBy<Result, Tables> & Limit<Result>
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

