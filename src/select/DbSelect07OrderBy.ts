import {Expr} from "../Types";
import {DbSelect08Limit} from "./DbSelect08Limit";

export class DbSelect07OrderBy<Result, Tables, CTX> extends DbSelect08Limit<Result, CTX> {

    public orderBy<
        TableRef extends string & Tables,
        Str extends string & keyof Result
    >(
        ...items: OrderByStructure<(Str | Expr<TableRef, string | unknown, string | number>)>
    ): DbSelect08Limit<Result, CTX> {
        this.builder.orderBy(items as any);
        return new DbSelect08Limit(this.builder);
    }
}

export function orderByStructureToSqlString(items: [] | OrderByStructure<any>): string[] {
    const parts: string[] = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item === "asc" || item === "ASC" || item === "desc" || item === "DESC") {
            parts[parts.length - 1] += " " + item;
        } else if (typeof item === "string") {
            parts.push(item)
        } else if (item !== undefined && item !== null) {
            parts.push(item.expression)
        }
    }
    return parts;
}

/**
 * Anyone finds a better way, please write it. Rules are as follows:
 * 1) A is always first
 * 2) B can only appear after A
 */
export type OrderByStructure<A, B = ORDER_BY> =
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

export type ORDER_BY = "asc" | "desc" | "ASC" | "DESC"