import {OrderByStructure, Value} from "../Types";
import {DbSelect08Limit} from "./DbSelect08Limit";

export class DbSelect07OrderBy<Result, Tables, UsedTables, LastType, CTX> extends DbSelect08Limit<Result, UsedTables, LastType, CTX> {

    public orderBy<
        TableRef extends string & keyof Tables,
        Str extends string & keyof Result
    >(
        ...items: OrderByStructure<(Str | Value<TableRef, string | unknown, string | number>), "asc" | "ASC" | "desc" | "DESC">
    ): DbSelect08Limit<Result, UsedTables, LastType, CTX> {
        this.builder.orderBy(items);
        return new DbSelect08Limit(this.builder);
    }
}
