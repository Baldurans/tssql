import {CheckForDuplicateColumns, ExtractObj, Value} from "../Types";
import {SqlExpression} from "../SqlExpression";
import {DbSelect04Where} from "./DbSelect04Where";
import {DbSelect} from "./DbSelect";

/**
 * Format of UsedAliases: {} & Record<"a", true> & Record<"b", true> & ...
 * Format of Tables: {} & Record<"a.user", true> & Record<"b.company", true> & ...
 * Format of UsedTables: {} & Record<"a.user", true> & Record<"b.company", true> & ...
 * Format of Result: {} & Record<"a.user", true> & Record<"b.company", true> & ...
 * LastType is just lastType that was seen via column calls. It has a specific usecase :)
 */
export class DbSelect03Columns<Result, UsedAliases, WithAliases, Tables, UsedTables> extends DbSelect {

    public distinct(): this {
        this.builder._distinct = true;
        return this;
    }

    public columns<
        TableRef extends string & keyof Tables,
        Columns extends Value<TableRef, string, string | number>[]
    >(
        //...columns: Columns - this will enable seeing sources of Result object properties.
        ...columns: CheckForDuplicateColumns<Columns, Result>
    ): DbSelect04Where<Result & ExtractObj<Columns>, UsedAliases, WithAliases, Tables, UsedTables, Columns[number]["type"]> {
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i] as unknown as SqlExpression<string, string, any>;
            this.builder._columns.push(col.toString());
            (this.builder._columnStruct as any)[col.nameAs] = true;
        }
        return new DbSelect04Where(this.builder);
    }

}
