import {ExecMethods} from "./S7Exec";
import {GroupByMethods} from "./S3GroupBy";

export interface UnionMethods<Result, CTX> {

    union<Result2>(
        table: CompareObjectsForUnion<Result, Result2, ExecMethods<Result2, CTX>>
    ): UnionMethods<Result, CTX> & GroupByMethods<Result, {}, CTX>


    unionAll<Result2>(
        table: CompareObjectsForUnion<Result, Result2, ExecMethods<Result2, CTX>>
    ): UnionMethods<Result, CTX> & GroupByMethods<Result, {}, CTX>
}

export type CompareObjectsForUnion<Result1, Result2, Res> = Result1 extends Result2
    ? Result2 extends Result1
        ? Res
        : "Existing structure has more fields and does not match added structure."
    : "Added structure has more fields and does not match existing query structure"
