import {Value} from "../Types";
import {DbSelect07OrderBy} from "./DbSelect07OrderBy";
import {DbSelect06Having} from "./DbSelect06Having";

export class DbSelect05GroupBy<Result, Tables, UsedTables, LastType> extends DbSelect07OrderBy<Result, Tables, UsedTables, LastType> {

    public groupBy<
        TableRef extends string & keyof Tables,
        Str extends string & keyof Result
    >(
        ...items: (Str | Value<TableRef, string | unknown, string | number>)[]
    ): DbSelect06Having<Result, Tables, UsedTables, LastType> {
        for (let i = 0; i < items.length; i++) {
            this.builder._groupBy.push(String(items[i]))
        }
        return new DbSelect06Having(this.builder);
    }

}
