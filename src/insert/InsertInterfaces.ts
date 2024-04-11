import {AliasedTable, NotUsingWithPart, SqlQuery} from "../Types";

export interface ExecInsertMethods extends SqlQuery<{ insertId: number }> {

}

export interface InsertSetMethods<Entity> {

    set(value: Entity): ExecInsertMethods

    values(value: Entity[]): ExecInsertMethods

    select<Result>(value: IsAMatchingB<Result, Entity, AliasedTable<string, string, Result, object, NotUsingWithPart>>): ExecInsertMethods
}

type IsAMatchingB<Result, Entity, OUT> = _findDifferentPropertyNames<Result, Entity> extends never ? OUT : _findDifferentPropertyNames<Result, Entity>;

type _valuesToUnion<T> = T[keyof T];

type _findDifferentPropertyNames<Result, Entity> =
    _valuesToUnion<{ [K in Exclude<keyof Entity, keyof Result>]: `Property '${K extends string ? K : ""}' is missing!` }>
    | _valuesToUnion<{ [K in Exclude<keyof Result, keyof Entity>]: `Property '${K extends string ? K : ""}' should not be listed!` }>
    | _valuesToUnion<{ [K in keyof Result & keyof Entity]: Result[K] extends Entity[K] ? never : `Property '${K extends string ? K : ""}' type does not match!` }>;
