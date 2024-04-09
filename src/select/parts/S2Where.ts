import {isTableReferenced, Key, SQL_BOOL} from "../../Types";
import {constructGroupBy, GroupBy} from "./S3GroupBy";
import {AnyExpr, Expr} from "../../SqlExpression";
import {constructOrderBy, OrderBy} from "./S5OrderBy";
import {constructLimit, Limit} from "./S6Limit";
import {SelectBuilder} from "../SelectBuilder";

export function constructWhere<Result, Tables>(builder: SelectBuilder): Where<Result, Tables> {
    return {
        noWhere: () => {
            return {
                ...constructGroupBy(builder),
                ...constructOrderBy(builder),
                ...constructLimit(builder)
            }
        },
        where: (...cols: any) => {
            for (let i = 0; i < cols.length; i++) {
                builder.where(cols[i] as unknown as AnyExpr)
            }
            return {
                ...constructGroupBy(builder),
                ...constructOrderBy(builder),
                ...constructLimit(builder)
            }
        }

    }
}

export interface Where<Result, Tables> {

    noWhere(): GroupBy<Result, Tables> & OrderBy<Result, Tables> & Limit<Result>

    where<T1 extends string = never, T2 extends string = never, T3 extends string = never, T4 extends string = never, T5 extends string = never, T6 extends string = never, T7 extends string = never, T8 extends string = never, T9 extends string = never, T10 extends string = never, T = Tables>(
        c1: C<T, T1>, c2?: C<T, T2>, c3?: C<T, T3>, c4?: C<T, T4>, c5?: C<T, T5>, c6?: C<T, T6>, c7?: C<T, T7>, c8?: C<T, T8>, c9?: C<T, T9>, c10?: C<T, T10>
    ): GroupBy<Result, Tables> & OrderBy<Result, Tables> & Limit<Result>

}

type C<Tables, T extends string> = isTableReferenced<Tables, Key<T>, Expr<T, unknown, SQL_BOOL>>


