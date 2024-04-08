import {S3GroupBy} from "./S3GroupBy";
import {S7Exec} from "./S7Exec";

export class S0Union<Result, CTX> extends S3GroupBy<Result, {}, CTX> {

    public distinct<Result2>(
        table: CompareObjects<Result, Result2, S7Exec<Result2, CTX>>
    ): S0Union<Result, CTX> {
        this.builder.union("", table.toString(1), (table as S7Exec<any, CTX>).getColumnStruct())
        return this as any;
    }

    public all<Result2>(
        table: CompareObjects<Result, Result2, S7Exec<Result2, CTX>>
    ): S0Union<Result, CTX> {
        this.builder.union("ALL", table.toString(1), (table as S7Exec<any, CTX>).getColumnStruct())
        return this as any;
    }

}

type CompareObjects<Result1, Result2, Res> = Result1 extends Result2
    ? Result2 extends Result1
        ? Res
        : "Existing structure has more fields and does not match added structure."
    : "Added structure has more fields and does not match existing query structure"