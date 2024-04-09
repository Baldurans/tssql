import {AliasedTable, Key, NotUsingWithPart, SQL_BOOL} from "../../Types";
import {isColumnOkToUse} from "./S3GroupBy";
import {AnyExpr, Expr, SqlExpression} from "../../SqlExpression";
import {SelectBuilder} from "../SelectBuilder";
import {constructOrderBy, OrderBy} from "./S5OrderBy";
import {constructLimit, Limit} from "./S6Limit";

export function constructHaving<Result, Tables>(builder: SelectBuilder): Having<Result, Tables> {
    return {
        having: (...col: any) => {
            builder.having(col as unknown as AnyExpr[])
            return {
                ...constructOrderBy(builder),
                ...constructLimit(builder)
            }
        },
        havingF: (func: any) => {
            const proxy: any = new Proxy({}, {
                get(target: {}, p: string, receiver: any): any {
                    return new SqlExpression(p, p)
                }
            })
            builder.having(func(proxy) as any);
            return {
                ...constructOrderBy(builder),
                ...constructLimit(builder)
            }
        }
    }
}

export interface Having<Result, Tables> {
    having<
        TableRef,
        Columns extends (Expr<TableRef, string | unknown, SQL_BOOL>)[]
    >(
        ...col: isColumnOkToUse<Tables, Columns>
    ): OrderBy<Result, Tables> & Limit<Result>

    havingF<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, SQL_BOOL>[]
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): OrderBy<Result, Tables> & Limit<Result>
}

