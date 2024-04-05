import {DbUtility} from "./DbUtility";

export type Key<Alias extends string> = Record<Alias, true>;

export type Expr<TableRef extends string, Name extends string | unknown, Type extends string | number | unknown> = symbol & {
    tableRef: TableRef
    type: Type
} & RuntimeExpr<TableRef, Name, Type>

export type RuntimeExpr<TableRef extends string, Name extends string | unknown, Type extends string | number | unknown> = {
    nameAs: Name
    expression: string

    cast: <CastType extends string | number>() => Expr<TableRef, Name, CastType>
    as: <T extends string>(name: T) => Expr<TableRef, T, Type>

    isNull: () => Expr<TableRef, unknown, SQL_BOOL>
    notNull: () => Expr<TableRef, unknown, SQL_BOOL>
    is: (value: Type) => Expr<TableRef, unknown, SQL_BOOL>
    eq: <TableRef2 extends string>(value: Expr<TableRef2, string | unknown, Type>) => Expr<TableRef | TableRef2, unknown, SQL_BOOL>
    // GT: (value: Type) => Value<TableRef, unknown, SQL_BOOL>
    // GTC: <TableRef2 extends string>(value: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    // GTE: (value: Type) => Value<TableRef, unknown, SQL_BOOL>
    // GTEC: <TableRef2 extends string>(value: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    // LT: (value: Type) => Value<TableRef, unknown, SQL_BOOL>
    // LTC: <TableRef2 extends string>(value: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    // LTE: (value: Type) => Value<TableRef, unknown, SQL_BOOL>
    // LTEC: <TableRef2 extends string>(value: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    compare: (op: COMPARISON_SIGNS, value: Type) => Expr<TableRef, unknown, SQL_BOOL>
    comparec: <TableRef2 extends string>(op: COMPARISON_SIGNS, col2: Expr<TableRef2, string | unknown, Type>) => Expr<TableRef | TableRef2, unknown, SQL_BOOL>
    like: (value: string) => Expr<TableRef, unknown, SQL_BOOL>
    startsWith: (value: string) => Expr<TableRef, unknown, SQL_BOOL>
    endsWith: (value: string) => Expr<TableRef, unknown, SQL_BOOL>
    contains: (value: string) => Expr<TableRef, unknown, SQL_BOOL>
    asDate: () => Expr<TableRef, Name, vDate>
    asDateTime: () => Expr<TableRef, Name, vDateTime>
}

export type AnyBoolExpr<TableRef extends string> = Expr<TableRef, string | unknown, SQL_BOOL>;

export type AnyExpr = Expr<string, string | unknown, string | number | unknown>

// ----------------------------------------------

export type AliasedTable<Alias extends string, TableRef extends string, Entity, AliasForWithQuery extends string | NotUsingWithPart> = {
    [DbUtility.SQL_ALIAS]: Alias
    [DbUtility.SQL_EXPRESSION]: TableRef
    [DbUtility.SQL_ALIAS_FOR_WITH_QUERY]: AliasForWithQuery
} & {
    [K in keyof Entity]: Expr<TableRef, K, Entity[K]>
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
export type isAliasAlreadyUsed<Aliases, Alias extends string, OUT> = Alias extends Aliases ? `Alias '${Alias}' is already used!` : OUT

// ----------------------------------------------
// This stuff helps to check if 'Table as Alias' exists in usedTables

type _ExtractMissingAlias<Tables, CheckTables> = { [K in keyof CheckTables]: K extends keyof Tables ? never : K }[keyof CheckTables];
type _ConstructAliasDoesNotExistError<Tables, CheckTables> = `Alias '${_ExtractMissingAlias<Tables, CheckTables> extends `${infer TableName} as ${infer Alias}` ? Alias : "???"}' is not used in this query!`
/**
 * Check if UsedTablesToMatch=(R<Alias.Table> & ...) exists in UsedTables=(R<Alias.Table> & ...)
 */
export type isTableReferenced<Tables, CheckTables, OUT> = CheckTables extends Tables
    ? OUT
    : _ConstructAliasDoesNotExistError<Tables, CheckTables>;

// -----------------------------------------------------
