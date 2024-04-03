import {SQL} from "./SQL";
import {AliasedTable, NOT_REFERENCED, TrueRecord} from "./Types";
import {DbSelect00Uses} from "./select/DbSelect00Uses";
import {DbSelect00With} from "./select/DbSelect00With";
import {DbSelectBuilder} from "./select/DbSelectBuilder";
import {DbSelect01From} from "./select/DbSelect01From";
import {DbUtility} from "./DbUtility";
import {DbSelect00Union} from "./select/DbSelect00Union";
import {DbSelect09Exec} from "./select/DbSelect09Exec";


export abstract class Db {


    public abstract query(sql: string): any;

    public select(): DbSelect01From<{}, {}, {}, {}> {
        return new DbSelect01From(new DbSelectBuilder(this)) as any
    }

    public uses<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>
    ): DbSelect00Uses<TrueRecord<Alias>, TrueRecord<TableRef>> {
        return new DbSelect00Uses(new DbSelectBuilder(this));
    }

    public with<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>
    ): DbSelect00With<TrueRecord<Alias>, TrueRecord<TableRef>> {
        return new DbSelect00With(new DbSelectBuilder(this)).with(table as any);
    }

    public union<Result>(
        table: DbSelect09Exec<Result, any, any>
    ): DbSelect00Union<Result, unknown, unknown, {}, unknown> {
        return new DbSelect00Union<Result, unknown, unknown, {}, unknown>(new DbSelectBuilder(this)).all(table as any);
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
        return DbUtility.defineDbTable(SQL.escapeId(table[DbUtility.SQL_ALIAS]), newAlias, definition) as any;
    }

    protected getDbTableAliasFunction<TableName extends string, Entity>(
        tableName: TableName,
        columns: DbTableDefinition<Entity>
    ): <Alias extends string>(alias: Alias) => AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NOT_REFERENCED> {
        return <Alias extends string>(alias: Alias) => DbUtility.defineDbTable<TableName, Alias, Entity>(SQL.escapeId(tableName) as TableName, alias, columns);
    }

}

export type DbTableDefinition<T> = {
    [P in keyof T]: true
};
