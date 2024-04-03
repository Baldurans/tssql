import {Value} from "../Types";
import {DbSelectOrderBy} from "./DbSelectOrderBy";
import {DbSelectHaving} from "./DbSelectHaving";

export class DbSelectGroupBy<Result, Tables, UsedTables, LastType> extends DbSelectOrderBy<Result, Tables, UsedTables, LastType> {

    public groupBy<
        TableRef extends string & keyof Tables,
        Str extends string & keyof Result
    >(
        ...items: (Str | Value<TableRef, string | unknown, string | number>)[]
    ): DbSelectHaving<Result, Tables, UsedTables, LastType> {
        for (let i = 0; i < items.length; i++) {
            this.parts._groupBy.push(String(items[i]))
        }
        return new DbSelectHaving(this.db, this.parts);
    }

}
