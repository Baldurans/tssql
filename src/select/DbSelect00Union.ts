import {DbSelect05GroupBy} from "./DbSelect05GroupBy";
import {DbSelect09Exec} from "./DbSelect09Exec";
import {CompareObjects} from "../Types";

export class DbSelect00Union<Result, UsedAliases, Tables, UsedTables, LastType> extends DbSelect05GroupBy<Result, Tables, UsedTables, LastType> {

    public distinct<Result2>(
        table: CompareObjects<Result, Result2, DbSelect09Exec<Result2, any, any>>
    ): DbSelect00Union<Result, UsedAliases, Tables, UsedTables, LastType> {
        this.builder.union("", table.toString(1), (table as DbSelect09Exec<any, any, any>).getColumnStruct())
        return this as any;
    }

    public all<Result2>(
        table: CompareObjects<Result, Result2, DbSelect09Exec<Result2, any, any>>
    ): DbSelect00Union<Result, UsedAliases, Tables, UsedTables, LastType> {
        this.builder.union("ALL", table.toString(1), (table as DbSelect09Exec<any, any, any>).getColumnStruct())
        return this as any;
    }

}
