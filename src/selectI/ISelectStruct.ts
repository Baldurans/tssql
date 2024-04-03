import {AliasedTable, CheckForDuplicateColumns, CheckIfAliasedTablesAreReferenced, CheckIfAliasIsAlreadyUsed, ExtractObj, NOT_REFERENCED, R, SQL_BOOL, Value} from "../Types";
import {DbSelect05GroupBy} from "../select/DbSelect05GroupBy";

export interface IDbSelectFrom<UsedAliases, WithAliases, Tables, UsedTables> {

    forUpdate(): IDbSelectFrom<UsedAliases, WithAliases, Tables, UsedTables>

    from<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>
    ): IDbSelectJoin<UsedAliases & R<Alias>, WithAliases, Tables & R<TableRef>, UsedTables>

}

export interface IDbSelectJoin<UsedAliases, WithAliases, Tables, UsedTables> extends IDbSelectColumns<{}, UsedAliases, WithAliases, Tables, UsedTables> {

    join<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        RefAlias extends NOT_REFERENCED | string & keyof WithAliases,
        Columns,
        Field1Type extends string | number,
        Field2Alias extends string & keyof UsedAliases,
        Field2TableName extends string,
        Field2TableRef extends `${Field2TableName} as ${Field2Alias}`,
        Field2Type extends Field1Type
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases & WithAliases, Alias, AliasedTable<Alias, TableRef, Columns, RefAlias>>,
        field1: Value<TableRef, string, Field1Type>,
        field2: Value<Field2TableRef, string, Field2Type>
    ): IDbSelectJoin<UsedAliases & R<Alias>, WithAliases, Tables & R<TableRef>, UsedTables>

    leftJoin<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        RefAlias extends NOT_REFERENCED | string & keyof WithAliases,
        Columns,
        Field1Type extends string | number,
        Field2Alias extends string & keyof UsedAliases,
        Field2TableName extends string,
        Field2TableRef extends `${Field2TableName} as ${Field2Alias}`,
        Field2Type extends Field1Type
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases & WithAliases, Alias, AliasedTable<Alias, TableRef, Columns, RefAlias>>,
        field1: Value<TableRef, string, Field1Type>,
        field2: Value<Field2TableRef, string, Field2Type>
    ): IDbSelectJoin<UsedAliases & R<Alias>, WithAliases, Tables & R<TableRef>, UsedTables>
}


export interface IDbSelectColumns<Result, UsedAliases, WithAliases, Tables, UsedTables> {

    distinct(): IDbSelectColumns<Result, UsedAliases, WithAliases, Tables, UsedTables>

    columns<
        TableRef extends string & keyof Tables,
        Columns extends Value<TableRef, string, string | number>[]
    >(
        //...columns: Columns - this will enable seeing sources of Result object properties.
        ...columns: CheckForDuplicateColumns<Columns, Result>
    ): IDbSelectWhere1<Result & ExtractObj<Columns>, UsedAliases, WithAliases, Tables, UsedTables, Columns[number]["type"]>

}

export interface IDbSelectWhere1<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType> {

    noWhere(): DbSelect05GroupBy<Result, Tables, UsedTables, LastType>

    where<
        UsedTables2 extends string
    >(
        col: CheckIfAliasedTablesAreReferenced<Tables, R<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
    ): IDbSelectWhere2<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType>

}

export interface IDbSelectWhere2<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType> extends DbSelect05GroupBy<Result, Tables, UsedTables, LastType> {

    where<
        UsedTables2 extends string
    >(
        col: CheckIfAliasedTablesAreReferenced<Tables, R<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
    ): IDbSelectWhere2<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType>

}