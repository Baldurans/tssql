import {SelectBuilder} from "../SelectBuilder";
import {ExecMethods} from "./S7Exec";
import {getGroupByMethods, GroupByMethods} from "./S3GroupBy";

export function getUnionMethods<Result>(builder: SelectBuilder): UnionMethods<Result> {
    return {
        union: (table: any) => {
            builder.union("DISTINCT", table.toString(1), table.getColumnStruct())
            return getUnionCallMethods(builder)
        },
        unionAll: (table: any) => {
            builder.union("ALL", table.toString(1), table.getColumnStruct())
            return getUnionCallMethods(builder)
        }
    }
}

export function getUnionCallMethods<Result>(builder: SelectBuilder): UnionMethods<Result> & GroupByMethods<Result, {}> {
    return {
        ...getUnionMethods(builder),
        ...getGroupByMethods(builder)
    }
}

export interface UnionMethods<Result> {

    union<Result2>(
        table: CompareObjectsForUnion<Result, Result2, ExecMethods<Result2>>
    ): UnionMethods<Result> & GroupByMethods<Result, {}>


    unionAll<Result2>(
        table: CompareObjectsForUnion<Result, Result2, ExecMethods<Result2>>
    ): UnionMethods<Result> & GroupByMethods<Result, {}>
}

export type CompareObjectsForUnion<Result1, Result2, Res> = Result1 extends Result2
    ? Result2 extends Result1
        ? Res
        : "Existing structure has more fields and does not match added structure."
    : "Added structure has more fields and does not match existing query structure"