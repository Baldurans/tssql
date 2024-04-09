import {S7Exec} from "./S7Exec";
import {SelectQueryPart} from "../SelectQueryPart";

export class S0Union<Result> extends SelectQueryPart {

    public union<Result2>(
        table: CompareObjectsForUnion<Result, Result2, S7Exec<Result2>>
    ): S0Union<Result> {
        this.builder.union("DISTINCT", table.toString(1), (table as S7Exec<any>).getColumnStruct())
        return this as any;
    }

    public unionAll<Result2>(
        table: CompareObjectsForUnion<Result, Result2, S7Exec<Result2>>
    ): S0Union<Result> {
        this.builder.union("ALL", table.toString(1), (table as S7Exec<any>).getColumnStruct())
        return this as any;
    }

}



export type CompareObjectsForUnion<Result1, Result2, Res> = Result1 extends Result2
    ? Result2 extends Result1
        ? Res
        : "Existing structure has more fields and does not match added structure."
    : "Added structure has more fields and does not match existing query structure"