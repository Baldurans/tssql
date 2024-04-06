import {AliasedTable, Expr, Key, NotUsingWithPart} from "../Types";
import {DbSelect08Limit} from "./DbSelect08Limit";
import {isColumnOkToUse} from "./DbSelect05GroupBy";
import {SqlExpression} from "../SqlExpression";

export class DbSelect07OrderBy<Result, Tables, CTX> extends DbSelect08Limit<Result, CTX> {

    public orderBy<
        TableRef extends string,
        Str extends string,
        Columns extends OrderByStructure<(Str | Expr<TableRef, string | unknown, any, string | never>)>
    >(
        ...items: isColumnOkToUse<Result, Tables, Columns>
    ): DbSelect08Limit<Result, CTX> {
        this.builder.orderBy(items as any);
        return new DbSelect08Limit(this.builder);
    }

    public orderByF<
        TableRef extends string,
        StrNames extends string | never,
        Columns extends OrderByStructure<Expr<TableRef, string | unknown, string | number, StrNames>>
    >(
        func: (columnsTable: AliasedTable<"__res", "__res", Result, NotUsingWithPart>) => isColumnOkToUse<Result, Tables & Key<"__res">, Columns>
    ): DbSelect07OrderBy<Result, Tables, CTX> {
        const proxy: any = new Proxy({}, {
            get(target: {}, p: string, receiver: any): any {
                return new SqlExpression(p, p)
            }
        })
        this.builder.orderBy(func(proxy) as any);
        return new DbSelect07OrderBy(this.builder)
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