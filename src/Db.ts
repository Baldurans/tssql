import {SQL} from "./SQL";
import {AliasedTable, NOT_REFERENCED, R} from "./Types";
import {SqlExpression} from "./SqlExpression";
import {DbSelect00Uses} from "./select/DbSelect00Uses";
import {DbSelect00With} from "./select/DbSelect00With";
import {DbSelectBuilder} from "./select/DbSelectBuilder";
import {IDbSelectFrom} from "./selectI/ISelectStruct";
import {DbSelect01From} from "./select/DbSelect01From";


export abstract class Db {

    public static readonly SQL_EXPRESSION = Symbol("Table expression")
    public static readonly SQL_ALIAS = Symbol("Alias")
    public static readonly SQL_REF_ALIAS = Symbol("RefAlias")

    public abstract query(sql: string): any;

    public select(): IDbSelectFrom<{}, {}, {}, {}> {
        return new DbSelect01From(new DbSelectBuilder(this)) as any
    }

    public uses<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>
    ): DbSelect00Uses<R<Alias>, R<TableRef>> {
        return new DbSelect00Uses(new DbSelectBuilder(this));
    }

    public with<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>
    ): DbSelect00With<R<Alias>, R<TableRef>> {
        return new DbSelect00With(new DbSelectBuilder(this)).with(table as any);
    }

    public static createRef<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Entity,
        NewAlias extends string
    >(table: AliasedTable<Alias, TableRef, Entity, NOT_REFERENCED>, newAlias: NewAlias): AliasedTable<NewAlias, `${TableName} as ${NewAlias}`, Entity, Alias> {
        const definition: DbTableDefinition<Entity> = {} as any;
        for (const k in table) {
            (definition as any)[k] = (table as any)[k];
        }
        return Db.defineDbTable(SQL.escapeId(table[Db.SQL_ALIAS]), newAlias, definition) as any;
    }

    protected getDbTableAliasFunction<TableName extends string, Entity>(
        tableName: TableName,
        columns: DbTableDefinition<Entity>
    ): <Alias extends string>(alias: Alias) => AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NOT_REFERENCED> {
        return <Alias extends string>(alias: Alias) => Db.defineDbTable<TableName, Alias, Entity>(SQL.escapeId(tableName) as TableName, alias, columns);
    }

    public static defineDbTable<TableName extends string, Alias extends string, Entity>(
        escapedExpression: TableName,
        alias: string,
        columns: DbTableDefinition<Entity>
    ): AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NOT_REFERENCED> {
        const tbl: AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NOT_REFERENCED> = {
            [Db.SQL_EXPRESSION]: escapedExpression,
            [Db.SQL_ALIAS]: alias,
            //createRef: (table: any, newAlias: any) => this.createRef(table, newAlias)
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
