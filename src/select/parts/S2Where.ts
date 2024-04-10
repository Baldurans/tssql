import {isTableReferenced, Key, SQL_BOOL} from "../../Types";
import {GroupByMethods} from "./S3GroupBy";
import {Expr} from "../../SqlExpression";
import {OrderByMethods} from "./S5OrderBy";
import {LimitMethods} from "./S6Limit";
import {ExecMethods} from "./S7Exec";

export interface WhereMethods<Result, Tables, CTX> {

    noWhere(): GroupByMethods<Result, Tables, CTX> & OrderByMethods<Result, Tables, CTX> & LimitMethods<Result, CTX> & ExecMethods<Result, CTX>

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
    ): GroupByMethods<Result, Tables, CTX> & OrderByMethods<Result, Tables, CTX> & LimitMethods<Result, CTX> & ExecMethods<Result, CTX>

}

type C<Tables, T extends string> = isTableReferenced<Tables, Key<T>, Expr<T, unknown, SQL_BOOL>>


