import {OrderByStructure, Value} from "../Types";
import {DbSelect08Limit} from "./DbSelect08Limit";

export class DbSelect07OrderBy<Result, Tables, LastType, CTX> extends DbSelect08Limit<Result, LastType, CTX> {

    public orderBy<
        TableRef extends string & keyof Tables,
        Str extends string & keyof Result
    >(
        ...items: OrderByStructure<(Str | Value<TableRef, string | unknown, string | number>), "asc" | "ASC" | "desc" | "DESC">
    ): DbSelect08Limit<Result, LastType, CTX> {
        this.builder.orderBy(items as any);
        return new DbSelect08Limit(this.builder);
    }
}
