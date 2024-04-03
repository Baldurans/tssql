import {AliasedTable, AnyAliasedTableDef, CheckIfAliasIsAlreadyUsed, NOT_REFERENCED, TrueRecord, Value} from "../Types";
import {DbSelect03Columns} from "./DbSelect03Columns";

export class DbSelectJoin<UsedAliases, WithAliases, Tables, UsedTables> extends DbSelect03Columns<{}, UsedAliases, WithAliases, Tables, UsedTables> {

    public join<
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
    ): DbSelectJoin<UsedAliases & TrueRecord<Alias>, WithAliases, Tables & TrueRecord<TableRef>, UsedTables> {
        this.builder.join("JOIN", table as AnyAliasedTableDef, field1, field2)
        return this as any;
    }

    public leftJoin<
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
    ): DbSelectJoin<UsedAliases & TrueRecord<Alias>, WithAliases, Tables & TrueRecord<TableRef>, UsedTables> {
        this.builder.join("LEFT JOIN", table as AnyAliasedTableDef, field1, field2)
        return this as any;
    }


}
