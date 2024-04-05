import {DbUtility} from "./DbUtility";

export type Key<Alias extends string> = Record<Alias, true>;

export type Expr<TableRef extends string, Name extends string | unknown, Type extends string | number | unknown, StrNames> = symbol & {
    tableRef: TableRef
    type: Type
    seenResultColumnNames: StrNames
} & RuntimeExpr<TableRef, Name, Type, StrNames>

export type RuntimeExpr<TableRef extends string, Name extends string | unknown, Type extends string | number | unknown, StrNames> = {
    nameAs: Name
    expression: string

    cast: <CastType extends string | number>() => Expr<TableRef, Name, CastType, StrNames>
    as: <T extends string>(name: T) => Expr<TableRef, T, Type, StrNames>

    isNull: () => Expr<TableRef, unknown, SQL_BOOL, StrNames>
    notNull: () => Expr<TableRef, unknown, SQL_BOOL, StrNames>
    is: (value: Type) => Expr<TableRef, unknown, SQL_BOOL, StrNames>
    eq: <TableRef2 extends string, StrNames2 extends string>(value: Expr<TableRef2, string | unknown, Type, StrNames2>) => Expr<TableRef | TableRef2, unknown, SQL_BOOL, StrNames | StrNames2>
    // GT: (value: Type) => Value<TableRef, unknown, SQL_BOOL>
    // GTC: <TableRef2 extends string>(value: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    // GTE: (value: Type) => Value<TableRef, unknown, SQL_BOOL>
    // GTEC: <TableRef2 extends string>(value: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    // LT: (value: Type) => Value<TableRef, unknown, SQL_BOOL>
    // LTC: <TableRef2 extends string>(value: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    // LTE: (value: Type) => Value<TableRef, unknown, SQL_BOOL>
    // LTEC: <TableRef2 extends string>(value: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    compare: (op: COMPARISON_SIGNS, value: Type) => Expr<TableRef, unknown, SQL_BOOL, StrNames>
    comparec: <TableRef2 extends string, StrNames2 extends string>(op: COMPARISON_SIGNS, col2: Expr<TableRef2, string | unknown, Type, StrNames2>) => Expr<TableRef | TableRef2, unknown, SQL_BOOL, StrNames | StrNames2>
    like: (value: string) => Expr<TableRef, unknown, SQL_BOOL, StrNames>
    startsWith: (value: string) => Expr<TableRef, unknown, SQL_BOOL, StrNames>
    endsWith: (value: string) => Expr<TableRef, unknown, SQL_BOOL, StrNames>
    contains: (value: string) => Expr<TableRef, unknown, SQL_BOOL, StrNames>
    asDate: () => Expr<TableRef, Name, vDate, StrNames>
    asDateTime: () => Expr<TableRef, Name, vDateTime, StrNames>
}

export type AnyBoolExpr<TableRef extends string> = Expr<TableRef, string | unknown, SQL_BOOL, any>;

export type AnyExpr = Expr<string, string | unknown, string | number | unknown, any>

// ----------------------------------------------

export type AliasedTable<Alias extends string, TableRef extends string, Entity, AliasForWithQuery extends string | NotUsingWithPart> = {
    [DbUtility.SQL_ALIAS]: Alias
    [DbUtility.SQL_EXPRESSION]: TableRef
    [DbUtility.SQL_ALIAS_FOR_WITH_QUERY]: AliasForWithQuery
} & {
    [K in keyof Entity]: Expr<TableRef, K, Entity[K], never>
}

export type AnyAliasedTableDef = AliasedTable<string, string, {}, string | NotUsingWithPart>

export type NotUsingWithPart = { __not_referenced: true }

export type PrepareQueryArgument = { __prepare_argument: true, name: string }

export function isPrepareArgument(arg: unknown): arg is PrepareQueryArgument {
    return (arg as any)?.__prepare_argument === true;
}

// ----------------------------------------------

export type SQL_BOOL = 0 | 1;

export type vDate = string & { vDate: true, format: "YYYY-MM-DD" }

export type vDateTime = string & { vDateTime: true, format: "YYYY-MM-DD HH:II:SS" }

export type COMPARISON_SIGNS = "!=" | "=" | ">=" | ">" | "<" | "<=" | "LIKE" | "NOT LIKE"

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

// -----------------------------------------------------
