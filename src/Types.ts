import {DbUtility} from "./DbUtility";

export type Key<Alias extends string> = Record<Alias, true>;

export type Value<TableRef extends string, Name extends string | unknown, Type extends string | number | unknown> = symbol & {
    tableRef: TableRef
    type: Type
} & RuntimeValue<TableRef, Name, Type>

export type RuntimeValue<TableRef extends string, Name extends string | unknown, Type extends string | number | unknown> = {
    nameAs: Name
    expression: string

    cast: <CastType extends string | number>() => Value<TableRef, Name, CastType>
    as: <T extends string>(name: T) => Value<TableRef, T, Type>

    isNull: () => Value<TableRef, unknown, SQL_BOOL>
    notNull: () => Value<TableRef, unknown, SQL_BOOL>
    is: (value: Type) => Value<TableRef, unknown, SQL_BOOL>
    eq: <TableRef2 extends string>(value: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    // GT: (value: Type) => Value<TableRef, unknown, SQL_BOOL>
    // GTC: <TableRef2 extends string>(value: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    // GTE: (value: Type) => Value<TableRef, unknown, SQL_BOOL>
    // GTEC: <TableRef2 extends string>(value: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    // LT: (value: Type) => Value<TableRef, unknown, SQL_BOOL>
    // LTC: <TableRef2 extends string>(value: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    // LTE: (value: Type) => Value<TableRef, unknown, SQL_BOOL>
    // LTEC: <TableRef2 extends string>(value: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    compare: (op: COMPARISON_SIGNS, value: Type) => Value<TableRef, unknown, SQL_BOOL>
    comparec: <TableRef2 extends string>(op: COMPARISON_SIGNS, col2: Value<TableRef2, string | unknown, Type>) => Value<TableRef | TableRef2, unknown, SQL_BOOL>
    like: (value: string) => Value<TableRef, unknown, SQL_BOOL>
    startsWith: (value: string) => Value<TableRef, unknown, SQL_BOOL>
    endsWith: (value: string) => Value<TableRef, unknown, SQL_BOOL>
    contains: (value: string) => Value<TableRef, unknown, SQL_BOOL>
    asDate: () => Value<TableRef, Name, vDate>
    asDateTime: () => Value<TableRef, Name, vDateTime>
}

export type AnyBoolValue<TableRef extends string> = Value<TableRef, string | unknown, SQL_BOOL>;

export type AnyValue = Value<string, string | unknown, string | number | unknown>

export type AliasedTable<Alias extends string, TableRef extends string, Entity, RefAlias extends string | NOT_REFERENCED> = {
    [DbUtility.SQL_EXPRESSION]: TableRef
    [DbUtility.SQL_ALIAS]: Alias
    [DbUtility.SQL_REF_ALIAS]: RefAlias
} & {
    [K in keyof Entity]: Value<TableRef, K, Entity[K]>
}

export type AnyAliasedTableDef = AliasedTable<string, string, {}, string | NOT_REFERENCED>

export type NOT_REFERENCED = { __not_referenced: true }

// ----------------------------------------------

export type SQL_BOOL = 0 | 1;

/**
 * YYYY-MM-DD
 */
export type vDate = string & { vDate: true }
/**
 * YYYY-MM-DD HH:II:SS
 */
export type vDateTime = string & { vDateTime: true }

export type COMPARISON_SIGNS = "!=" | "=" | ">=" | ">" | "<" | "<=" | "LIKE" | "NOT LIKE"

const ComparisonOperandsLookup: Set<COMPARISON_SIGNS> = new Set(["!=", "=", ">=", ">", "<", "<=", "LIKE", "NOT LIKE"] as const)

export {ComparisonOperandsLookup}

// ----------------------------------------------

/**
 * Check if Alias ("c") already exists in UsedAliases=(R<"c"> & ...)
 */
export type isAliasAlreadyUsed<UsedAliases, Alias extends string, OUT> = Alias extends keyof UsedAliases ? `Alias '${Alias}' is already used!` : OUT

// ----------------------------------------------
// This stuff helps to check if 'Table as Alias' exists in usedTables

type _AllKeys<T> = T extends any ? keyof T : never;
type _ExtractMissingAlias<Used, ToMatch> = { [K in keyof ToMatch]: K extends keyof Used ? never : K }[keyof ToMatch];
type _ConstructAliasDoesNotExistError<UsedTables, UsedTablesToMatch> = `Alias '${_ExtractMissingAlias<UsedTables, UsedTablesToMatch> extends `${infer TableName} as ${infer Alias}` ? Alias : "???"}' is not used in this query!`
/**
 * Check if UsedTablesToMatch=(R<Alias.Table> & ...) exists in UsedTables=(R<Alias.Table> & ...)
 */
export type isTableReferenced<Tables, CheckTables, OUT> = _AllKeys<CheckTables> extends _AllKeys<Tables>
    ? OUT
    : _ConstructAliasDoesNotExistError<Tables, CheckTables>;

// -----------------------------------------------------
