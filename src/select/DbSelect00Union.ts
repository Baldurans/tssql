import {DbSelect05GroupBy} from "./DbSelect05GroupBy";
import {DbSelect09Exec} from "./DbSelect09Exec";
import {CompareObjects} from "../Types";

export class DbSelect00Union<Result, CTX> extends DbSelect05GroupBy<Result, {}, unknown, CTX> {

    public distinct<Result2>(
        table: CompareObjects<Result, Result2, DbSelect09Exec<Result2, any, CTX>>
    ): DbSelect00Union<Result, CTX> {
        this.builder.union("", table.toString(1), (table as DbSelect09Exec<any, any, CTX>).getColumnStruct())
        return this as any;
    }

    public all<Result2>(
        table: CompareObjects<Result, Result2, DbSelect09Exec<Result2, any, CTX>>
    ): DbSelect00Union<Result, CTX> {
        this.builder.union("ALL", table.toString(1), (table as DbSelect09Exec<any, any, CTX>).getColumnStruct())
        return this as any;
    }

}
