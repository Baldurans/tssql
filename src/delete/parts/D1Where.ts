import {isTableReferenced, Key, SQL_BOOL} from "../../Types";
import {Expr} from "../../SqlExpression";
import {DeleteOrderByMethods, getDeleteOrderByMethods} from "./D2OrderBy";
import {DeleteLimitMethods} from "./D3Limit";
import {DeleteBuilder} from "../DeleteBuilder";

export function getDeleteWhereMethods<Tables>(builder: DeleteBuilder): DeleteWhereMethods<Tables> {
    return {
        where: (...cols: any) => {
            for (let i = 0; i < cols.length; i++) {
                if (cols[i]) {
                    builder.where(cols[i].expression)
                }
            }
            return getDeleteOrderByMethods(builder)
        }
    }
}

export interface DeleteWhereMethods<Tables> {

    where<
        T1 extends string,
        T2 extends string = never,
        T3 extends string = never,
        T4 extends string = never,
        T5 extends string = never,
        T6 extends string = never,
        T7 extends string = never,
        T8 extends string = never,
        T9 extends string = never,
        T10 extends string = never,
        T = Tables
    >(
        c1: C<T, T1>,
        c2?: C<T, T2>,
        c3?: C<T, T3>,
        c4?: C<T, T4>,
        c5?: C<T, T5>,
        c6?: C<T, T6>,
        c7?: C<T, T7>,
        c8?: C<T, T8>,
        c9?: C<T, T9>,
        c10?: C<T, T10>
    ): DeleteOrderByMethods<Tables> & DeleteLimitMethods

}

type C<Tables, T extends string> = isTableReferenced<Tables, Key<T>, Expr<T, unknown, SQL_BOOL>>


