import {DbSelect05GroupBy} from "./DbSelect05GroupBy";
import {DbSelect09Exec} from "./DbSelect09Exec";

export class DbSelect00Union<Result, CTX> extends DbSelect05GroupBy<Result, {}, CTX> {

    public distinct<Result2>(
        table: CompareObjects<Result, Result2, DbSelect09Exec<Result2, CTX>>
    ): DbSelect00Union<Result, CTX> {
        this.builder.union("", table.toString(1), (table as DbSelect09Exec<any, CTX>).getColumnStruct())
        return this as any;
    }

    public all<Result2>(
        table: CompareObjects<Result, Result2, DbSelect09Exec<Result2, CTX>>
    ): DbSelect00Union<Result, CTX> {
        this.builder.union("ALL", table.toString(1), (table as DbSelect09Exec<any, CTX>).getColumnStruct())
        return this as any;
    }

}

type CompareObjects<Result1, Result2, Res> = Result1 extends Result2
    ? Result2 extends Result1
        ? Res
        : "Existing structure has more fields and does not match added structure."
    : "Added structure has more fields and does not match existing query structure"