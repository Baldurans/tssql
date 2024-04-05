import {AnyExpr, isTableReferenced, SQL_BOOL, Key, Expr} from "../Types";
import {DbSelect} from "./DbSelect";
import {DbSelect05GroupBy} from "./DbSelect05GroupBy";

export class DbSelect04Where<Result, Tables, CTX> extends DbSelect<CTX> {
    public noWhere(): DbSelect05GroupBy<Result, Tables, CTX> {
        return new DbSelect05GroupBy(this.builder)
    }


    // Recursive type to handle same thing, but TS does not recognize that input is a duple, but takes it as (A | B)[], but needed would be [A,B]
    // Issue why it is needed is to highlight exactly which where argument is flawed. Otherwise, whole where call will be marked as invalid with very ambiguous error message.
    // Can use something like this if it improves.
    // type CheckThatTablesAreAllAddedToTheQuery<Cols, Tables> = Cols extends [infer A, ...(infer B)]
    //     ? [
    //         A extends Value<infer UsedTables2, unknown, SQL_BOOL>
    //             ? CheckIfAliasedTablesAreReferenced<Tables, TrueRecord<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
    //             : "Invalid argument",
    //         ...CheckThatTablesAreAllAddedToTheQuery<B, Tables>
    //     ]
    //     : []

    public where<T1 extends string, T = Tables>(
        c1: C<T, T1>,
    ): DbSelect05GroupBy<Result, Tables, CTX>
    public where<T1 extends string, T2 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>,
    ): DbSelect05GroupBy<Result, Tables, CTX>
    public where<T1 extends string, T2 extends string, T3 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>
    ): DbSelect05GroupBy<Result, Tables, CTX>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>
    ): DbSelect05GroupBy<Result, Tables, CTX>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>, c5: C<T, T5>
    ): DbSelect05GroupBy<Result, Tables, CTX>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>, c5: C<T, T5>, c6: C<T, T6>
    ): DbSelect05GroupBy<Result, Tables, CTX>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T7 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>, c5: C<T, T5>, c6: C<T, T6>, c7: C<T, T7>
    ): DbSelect05GroupBy<Result, Tables, CTX>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T7 extends string, T8 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>, c5: C<T, T5>, c6: C<T, T6>, c7: C<T, T7>, c8: C<T, T8>
    ): DbSelect05GroupBy<Result, Tables, CTX>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T7 extends string, T8 extends string, T9 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>, c5: C<T, T5>, c6: C<T, T6>, c7: C<T, T7>, c8: C<T, T8>, c9: C<T, T9>
    ): DbSelect05GroupBy<Result, Tables, CTX>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T7 extends string, T8 extends string, T9 extends string, T10 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>, c5: C<T, T5>, c6: C<T, T6>, c7: C<T, T7>, c8: C<T, T8>, c9: C<T, T9>, c10: C<T, T10>
    ): DbSelect05GroupBy<Result, Tables, CTX>
    public where(
        ...cols: any[]
    ): DbSelect05GroupBy<Result, Tables, CTX> {

        for (let i = 0; i < cols.length; i++) {
            this.builder.where(cols[i] as unknown as AnyExpr)
        }
        return new DbSelect05GroupBy(this.builder)
    }
}

type C<Tables, T extends string> = isTableReferenced<Tables, Key<T>, Expr<T, unknown, SQL_BOOL, any>>


