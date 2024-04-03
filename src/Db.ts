import {DbSelect} from "./DbSelect";
import {SQL} from "./SQL";
import {AliasedTable, R} from "./Types";
import {SqlExpression} from "./SqlExpression";
import {DbUses} from "./DbUses";
import {DbWith} from "./DbWith";


export abstract class Db {

    public static readonly SQL_EXPRESSION = Symbol("Table expression")
    public static readonly SQL_ALIAS = Symbol("Alias")
    public static readonly SQL_WITH_EXPRESSION = Symbol("Table expression")

    public abstract query(sql: string): any;

    public select(): DbSelect<{}, {}, {}, {}, unknown> {
        return new DbSelect(this)
    }

    public uses<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, any>
    ): DbUses<R<Alias>, R<TableRef>> {
        return new DbUses(this);
    }

    public with<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, any>
    ): DbWith<{}, R<TableRef>> {
        return new DbWith(this).with(table as any);
    }

    protected getDbTableAliasFunction<TableName extends string, Entity>(
        tableName: TableName,
        columns: DbTableDefinition<Entity>
    ): <Alias extends string>(alias: Alias) => AliasedTable<Alias, `${TableName} as ${Alias}`, Entity> {
        return <Alias extends string>(alias: Alias) => Db.defineDbTable<TableName, Alias, Entity>(SQL.escapeId(tableName) as TableName, alias, columns);
    }

    public static defineDbTable<TableName extends string, Alias extends string, Entity>(
        escapedExpression: TableName,
        alias: string,
        columns: DbTableDefinition<Entity>,
        withExpression?: string
    ): AliasedTable<Alias, `${TableName} as ${Alias}`, Entity> {
        const tbl: AliasedTable<Alias, `${TableName} as ${Alias}`, Entity> = {
            [Db.SQL_EXPRESSION]: escapedExpression,
            [Db.SQL_ALIAS]: alias
        } as any;
        for (const columnName in columns) {
            (tbl as any)[columnName] = new SqlExpression(SQL.escapeId(alias) + "." + SQL.escapeId(columnName), columnName)
        }
        Object.freeze(tbl)
        return tbl
    }
}

export type DbTableDefinition<T> = {
    [P in keyof T]: true
};
