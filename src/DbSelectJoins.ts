import {AliasedTable, CheckIfAliasIsAlreadyUsed, NOT_REFERENCED, R, Value} from "./Types";
import {SQL} from "./SQL";
import {Db} from "./Db";
import {DbSelectColumns} from "./DbSelectColumns";

export class DbSelectJoin<UsedAliases, WithAliases, Tables, UsedTables> extends DbSelectColumns<{}, UsedAliases, WithAliases, Tables, UsedTables> {

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
    ): DbSelectJoin<UsedAliases & R<Alias>, WithAliases, Tables & R<TableRef>, UsedTables> {
        return this._join("JOIN", table, field1, field2)
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
    ): DbSelectJoin<UsedAliases & R<Alias>, WithAliases, Tables & R<TableRef>, UsedTables> {
        return this._join("LEFT JOIN", table as any, field1, field2)
    }

    private _join<
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
        joinType: "JOIN" | "LEFT JOIN",
        table: CheckIfAliasIsAlreadyUsed<UsedAliases & WithAliases, Alias, AliasedTable<Alias, TableRef, Columns, RefAlias>>,
        field1: Value<TableRef, string, Field1Type>,
        field2: Value<Field2TableRef, string, Field2Type>
    ): DbSelectJoin<UsedAliases & R<Alias>, WithAliases, Tables & R<TableRef>, UsedTables> {
        if (typeof table === "string") { // This is pretty much to satisfy typescript issue, not really needed for practical purposes.
            throw new Error("Invalid argument! Got '" + typeof table + "'")
        }
        const sql = this.parts._withQueries.has(table[Db.SQL_ALIAS]) ? SQL.escapeId(table[Db.SQL_ALIAS]) : table[Db.SQL_EXPRESSION] + " as " + SQL.escapeId(table[Db.SQL_ALIAS])
        this.parts._joins.push(joinType + " " + sql + " ON (" + field1.expression + " = " + field2.expression + ")")
        return this as any;
    }


}
