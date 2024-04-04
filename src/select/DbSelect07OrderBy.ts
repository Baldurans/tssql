import {Expr} from "../Types";
import {DbSelect08Limit} from "./DbSelect08Limit";

export class DbSelect07OrderBy<Result, Tables, CTX> extends DbSelect08Limit<Result, CTX> {

    public orderBy<
        TableRef extends string & keyof Tables,
        Str extends string & keyof Result
    >(
        ...items: OrderByStructure<(Str | Expr<TableRef, string | unknown, string | number>), "asc" | "ASC" | "desc" | "DESC">
    ): DbSelect08Limit<Result, CTX> {
        this.builder.orderBy(items as any);
        return new DbSelect08Limit(this.builder);
    }
}

/**
 * Anyone finds a better way, please write it. Rules are as follows:
 * 1) A is always first
 * 2) B can only appear after A
 */
export type OrderByStructure<A, B> =
    [A]
    | [A, A]
    | [A, B]
    | [A, A, A]
    | [A, A, B]
    | [A, B, A]
    | [A, A, A, A]
    | [A, A, A, B]
    | [A, A, B, A]
    | [A, B, A, A]
    | [A, B, A, B]
    | [A, A, A, A, A]
    | [A, A, A, A, B]
    | [A, A, A, B, A]
    | [A, A, B, A, A]
    | [A, B, A, A, A]
    | [A, B, A, A, B]
    | [A, B, A, B, A]
    | [A, A, A, A, A, A]
    | [A, A, A, A, A, B]
    | [A, A, A, A, B, A]
    | [A, A, A, B, A, A]
    | [A, A, B, A, A, A]
    | [A, B, A, A, A, A]
    | [A, B, A, A, A, B]
    | [A, B, A, A, B, A]
    | [A, B, A, B, A, A]
    | [A, B, A, B, A, B]