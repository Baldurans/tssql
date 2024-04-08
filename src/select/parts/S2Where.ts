import {isTableReferenced, SQL_BOOL, Key} from "../../Types";
import {SelectQueryPart} from "../SelectQueryPart";
import {S3GroupBy} from "./S3GroupBy";
import {AnyExpr, Expr} from "../../SqlExpression";

export class S2Where<Result, Tables> extends SelectQueryPart {
    public noWhere(): S3GroupBy<Result, Tables> {
        return new S3GroupBy(this.builder)
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
    ): S3GroupBy<Result, Tables>
    public where<T1 extends string, T2 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>,
    ): S3GroupBy<Result, Tables>
    public where<T1 extends string, T2 extends string, T3 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>
    ): S3GroupBy<Result, Tables>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>
    ): S3GroupBy<Result, Tables>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>, c5: C<T, T5>
    ): S3GroupBy<Result, Tables>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>, c5: C<T, T5>, c6: C<T, T6>
    ): S3GroupBy<Result, Tables>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T7 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>, c5: C<T, T5>, c6: C<T, T6>, c7: C<T, T7>
    ): S3GroupBy<Result, Tables>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T7 extends string, T8 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>, c5: C<T, T5>, c6: C<T, T6>, c7: C<T, T7>, c8: C<T, T8>
    ): S3GroupBy<Result, Tables>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T7 extends string, T8 extends string, T9 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>, c5: C<T, T5>, c6: C<T, T6>, c7: C<T, T7>, c8: C<T, T8>, c9: C<T, T9>
    ): S3GroupBy<Result, Tables>
    public where<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T7 extends string, T8 extends string, T9 extends string, T10 extends string, T = Tables>(
        c1: C<T, T1>, c2: C<T, T2>, c3: C<T, T3>, c4: C<T, T4>, c5: C<T, T5>, c6: C<T, T6>, c7: C<T, T7>, c8: C<T, T8>, c9: C<T, T9>, c10: C<T, T10>
    ): S3GroupBy<Result, Tables>
    public where(
        ...cols: any[]
    ): S3GroupBy<Result, Tables> {

        for (let i = 0; i < cols.length; i++) {
            this.builder.where(cols[i] as unknown as AnyExpr)
        }
        return new S3GroupBy(this.builder)
    }
}

type C<Tables, T extends string> = isTableReferenced<Tables, Key<T>, Expr<T, unknown, SQL_BOOL>>


