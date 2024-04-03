import {OrderByStructure, Value} from "../Types";
import {SQL} from "../SQL";
import {DbSelectLimit} from "./DbSelectLimit";

export class DbSelectOrderBy<Result, Tables, UsedTables, LastType> extends DbSelectLimit<Result, UsedTables, LastType> {

    public orderBy<
        TableRef extends string & keyof Tables,
        Str extends string & keyof Result
    >(
        ...items: OrderByStructure<(Str | Value<TableRef, string | unknown, string | number>), "asc" | "ASC" | "desc" | "DESC">
    ): DbSelectLimit<Result, UsedTables, LastType> {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item === "asc" || item === "ASC" || item === "desc" || item === "DESC") {
                this.parts._orderBy[this.parts._orderBy.length - 1] += " " + item;
            } else if (typeof item === "string") {
                this.parts._orderBy.push(item)
            } else {
                this.parts._orderBy.push(item.nameAs ? SQL.escapeId(item.nameAs as any) : item.expression)
            }
        }
        return new DbSelectLimit(this.db, this.parts);
    }
}
