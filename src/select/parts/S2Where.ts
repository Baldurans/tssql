import {isTableReferenced, Key, SQL_BOOL} from "../../Types";
import {getGroupByMethods, GroupByMethods} from "./S3GroupBy";
import {AnyExpr, Expr} from "../../SqlExpression";
import {getOrderByMethods, OrderByMethods} from "./S5OrderBy";
import {getLimitMethods, LimitMethods} from "./S6Limit";
import {SelectBuilder} from "../SelectBuilder";

export function getWhereMethods<Result, Tables>(builder: SelectBuilder): WhereMethods<Result, Tables> {
    return {
        noWhere: () => {
            return {
                ...getGroupByMethods(builder),
                ...getOrderByMethods(builder),
                ...getLimitMethods(builder)
            }
        },
        where: (...cols: any) => {
            for (let i = 0; i < cols.length; i++) {
                builder.where(cols[i] as unknown as AnyExpr)
            }
            return {
                ...getGroupByMethods(builder),
                ...getOrderByMethods(builder),
                ...getLimitMethods(builder)
            }
        }

    }
}

export interface WhereMethods<Result, Tables> {

    noWhere(): GroupByMethods<Result, Tables> & OrderByMethods<Result, Tables> & LimitMethods<Result>

    where<T1 extends string = never, T2 extends string = never, T3 extends string = never, T4 extends string = never, T5 extends string = never, T6 extends string = never, T7 extends string = never, T8 extends string = never, T9 extends string = never, T10 extends string = never, T = Tables>(
        c1: C<T, T1>, c2?: C<T, T2>, c3?: C<T, T3>, c4?: C<T, T4>, c5?: C<T, T5>, c6?: C<T, T6>, c7?: C<T, T7>, c8?: C<T, T8>, c9?: C<T, T9>, c10?: C<T, T10>
    ): GroupByMethods<Result, Tables> & OrderByMethods<Result, Tables> & LimitMethods<Result>

}

type C<Tables, T extends string> = isTableReferenced<Tables, Key<T>, Expr<T, unknown, SQL_BOOL>>


