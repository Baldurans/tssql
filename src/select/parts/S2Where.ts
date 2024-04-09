import {isTableReferenced, Key, SQL_BOOL} from "../../Types";
import {getGroupByMethods, GroupByMethods} from "./S3GroupBy";
import {AnyExpr, Expr} from "../../SqlExpression";
import {OrderByMethods} from "./S5OrderBy";
import {LimitMethods} from "./S6Limit";
import {SelectBuilder} from "../SelectBuilder";

export function getWhereMethods<Result, Tables>(builder: SelectBuilder): WhereMethods<Result, Tables> {
    return {
        noWhere: () => {
            return getGroupByMethods(builder)
        },
        where: (...cols: any) => {
            for (let i = 0; i < cols.length; i++) {
                builder.where(cols[i] as unknown as AnyExpr)
            }
            return getGroupByMethods(builder)
        }
    }
}

export interface WhereMethods<Result, Tables> {

    noWhere(): GroupByMethods<Result, Tables> & OrderByMethods<Result, Tables> & LimitMethods<Result>

    where<
        T1 extends string = never,
        T2 extends string = never,
        T3 extends string = never,
        T4 extends string = never,
        T5 extends string = never,
        T6 extends string = never,
        T7 extends string = never,
        T8 extends string = never,
        T9 extends string = never,
        T10 extends string = never
    >(
        c1: C<Tables, T1>,
        c2?: C<Tables, T2>,
        c3?: C<Tables, T3>,
        c4?: C<Tables, T4>,
        c5?: C<Tables, T5>,
        c6?: C<Tables, T6>,
        c7?: C<Tables, T7>,
        c8?: C<Tables, T8>,
        c9?: C<Tables, T9>,
        c10?: C<Tables, T10>
    ): GroupByMethods<Result, Tables> & OrderByMethods<Result, Tables> & LimitMethods<Result>

}

type C<Tables, TableRef extends string> = isTableReferenced<Tables, Key<TableRef>, Expr<TableRef, unknown, SQL_BOOL>>


