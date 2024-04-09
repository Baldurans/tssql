import {AliasedTable, Key, NotUsingWithPart, SQL_BOOL} from "../../Types";
import {isColumnOkToUse} from "./S3GroupBy";
import {AnyExpr, Expr, SqlExpression} from "../../SqlExpression";
import {SelectBuilder} from "../SelectBuilder";
import {getOrderByMethods, OrderByMethods} from "./S5OrderBy";
import {getLimitMethods, LimitMethods} from "./S6Limit";

export function getHavingMethods<Result, Tables>(builder: SelectBuilder): HavingMethods<Result, Tables> {
    return {
        having: (...col: any) => {
            builder.having(col as unknown as AnyExpr[])
            return {
                ...getOrderByMethods(builder),
                ...getLimitMethods(builder)
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
                ...getOrderByMethods(builder),
                ...getLimitMethods(builder)
            }
        }
    }
}

export interface HavingMethods<Result, Tables> {
    having<
        TableRef,
        Columns extends (Expr<TableRef, string | unknown, SQL_BOOL>)[]
    >(
        ...col: isColumnOkToUse<Tables, Columns>
    ): OrderByMethods<Result, Tables> & LimitMethods<Result>

    havingF<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, SQL_BOOL>[]
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): OrderByMethods<Result, Tables> & LimitMethods<Result>
}

