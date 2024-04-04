import {Value} from "../Types";
import {DbSelect07OrderBy} from "./DbSelect07OrderBy";
import {DbSelect06Having} from "./DbSelect06Having";
import {DbSelect09Exec} from "./DbSelect09Exec";

export class DbSelect05GroupBy<Result, Tables, LastType, CTX> extends DbSelect07OrderBy<Result, Tables, LastType, CTX> {

    public groupBy<
        TableRef extends string & keyof Tables,
        Str extends string & keyof Result
    >(
        ...items: (Str | Value<TableRef, string | unknown, string | number>)[]
    ): DbSelect06Having<Result, Tables, LastType, CTX> {
        this.builder.groupBy(items as any);
        return new DbSelect06Having(this.builder);
    }

    public async execOne(ctx: CTX): Promise<Result | undefined> {
        this.builder.limit(1);
        return new DbSelect09Exec<Result, LastType, CTX>(this.builder).execOne(ctx)
    }

}
