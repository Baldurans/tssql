import {Expr} from "./SqlExpression";
import {SQL_ALIAS, SQL_ALIAS_FOR_WITH_QUERY, SQL_ENTITY, SQL_EXPRESSION} from "./Symbols";

export type Key<Alias extends string> = Record<Alias, true>;

// -----------------------------------------------------

export type AliasedTable<Alias extends string, TableRef, Entity, AliasForWithQuery extends string | NotUsingWithPart> = {
    [SQL_ALIAS]: Alias
    [SQL_EXPRESSION]: TableRef
    [SQL_ALIAS_FOR_WITH_QUERY]: AliasForWithQuery
    [SQL_ENTITY]: Entity
} & {
    [K in keyof Entity]: Expr<TableRef, K, Entity[K]>
}

export type AnyAliasedTableDef = AliasedTable<string, string, {}, string | NotUsingWithPart>

// ----------------------------------------------

export type NotUsingWithPart = { __not_referenced: true }

export type PrepareQueryArgument = { __prepare_argument: true, expression: string }

export function isPrepareArgument(arg: unknown): arg is PrepareQueryArgument {
    return (arg as any)?.__prepare_argument === true;
}

// ----------------------------------------------

export type SQL_BOOL = 0 | 1;

export type vDate = string & { vDate: true, format: "YYYY-MM-DD" }

export type vDateTime = string & { vDateTime: true, format: "YYYY-MM-DD HH:II:SS" }

export type COMPARISON_SIGNS = "!=" | "<>" | "=" | ">=" | ">" | "<" | "<=" | "LIKE" | "NOT LIKE"

const ComparisonOperandsLookup: Set<COMPARISON_SIGNS> = new Set(["!=", "=", ">=", ">", "<", "<=", "LIKE", "NOT LIKE"] as const)

export {ComparisonOperandsLookup}

// ----------------------------------------------

/**
 * Check if Alias ("c") already exists in UsedAliases=(R<"c"> & ...)
 */
export type isAliasAlreadyUsed<Aliases, Alias extends string, OUT> = Alias extends keyof Aliases ? `Alias '${Alias}' is already used!` : OUT

// ----------------------------------------------
// This stuff helps to check if 'Table as Alias' exists in usedTables

type _extractMissingAlias<Tables, CheckTables> = { [K in keyof CheckTables]: K extends keyof Tables ? never : K }[keyof CheckTables];
/**
 * Check if UsedTablesToMatch=(R<Alias.Table> & ...) exists in UsedTables=(R<Alias.Table> & ...)
 */
// type _AllKeys<T> = T extends any ? keyof T : never;
// export type isTableReferenced<Tables, CheckTables, OUT> = _AllKeys<CheckTables> extends _AllKeys<Tables> might be more correct if unions would be used, but we don't really use them in this place.
export type isTableReferenced<Tables, CheckTables, OUT> = keyof CheckTables extends keyof Tables
    ? OUT
    : `Table '${_extractMissingAlias<Tables, CheckTables> extends `${infer TableRef}` ? `${TableRef}` : "???"}' is not used in this query!`


// ----------------------------------------------

/**
 * Anyone finds a better way, please write it. Rules are as follows:
 * 1) A is always first
 * 2) B can only appear after A
 *
 To generate this stuff :)
 function gen(len) {
 if (len <= 0) return [];
 const results = new Set(["A"]);
 function generateCombinations(currentLen, currentStr) {
 if (currentLen >= len) return;
 const nextA = currentStr + ',A';
 generateCombinations(currentLen + 1, nextA);
 results.add(nextA);
 if (currentStr[currentStr.length - 1] !== 'B') {
 const nextB = currentStr + ',B';
 generateCombinations(currentLen, nextB);
 results.add(nextB);
 }
 }
 generateCombinations(1, 'A');
 return "[" + Array.from(results.values()).sort().join("]\n | [") + "]";
 }
 console.log(gen(5)); // Example usage
 */
export type ORDER_BY = "asc" | "desc" | "ASC" | "DESC"

export type OrderByStructure<A, B = ORDER_BY> =
    [A]
    | [A, A]
    | [A, A, A]
    | [A, A, A, A]
    | [A, A, A, A, A]
    | [A, A, A, A, B]
    | [A, A, A, A, B, A]
    | [A, A, A, B]
    | [A, A, A, B, A]
    | [A, A, A, B, A, A]
    | [A, A, A, B, A, B]
    | [A, A, A, B, A, B, A]
    | [A, A, B]
    | [A, A, B, A]
    | [A, A, B, A, A]
    | [A, A, B, A, A, A]
    | [A, A, B, A, A, B]
    | [A, A, B, A, A, B, A]
    | [A, A, B, A, B]
    | [A, A, B, A, B, A]
    | [A, A, B, A, B, A, A]
    | [A, A, B, A, B, A, B]
    | [A, A, B, A, B, A, B, A]
    | [A, B]
    | [A, B, A]
    | [A, B, A, A]
    | [A, B, A, A, A]
    | [A, B, A, A, A, A]
    | [A, B, A, A, A, B]
    | [A, B, A, A, A, B, A]
    | [A, B, A, A, B]
    | [A, B, A, A, B, A]
    | [A, B, A, A, B, A, A]
    | [A, B, A, A, B, A, B]
    | [A, B, A, A, B, A, B, A]
    | [A, B, A, B]
    | [A, B, A, B, A]
    | [A, B, A, B, A, A]
    | [A, B, A, B, A, A, A]
    | [A, B, A, B, A, A, B]
    | [A, B, A, B, A, A, B, A]
    | [A, B, A, B, A, B]
    | [A, B, A, B, A, B, A]
    | [A, B, A, B, A, B, A, A]
    | [A, B, A, B, A, B, A, B]
    | [A, B, A, B, A, B, A, B, A]