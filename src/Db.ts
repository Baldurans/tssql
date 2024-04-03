import {DbSelect} from "./DbSelect";
import {SQL} from "./SQL";
import {AliasedTable} from "./Types";
import {SqlExpression} from "./SqlExpression";


export class Db {

    public static readonly SQL_EXPRESSION = Symbol("Table expression")

    public select(): DbSelect<{}, {}, {}, {}, unknown> {
        return new DbSelect()
    }

    protected getDbTableAliasFunction<TableName extends string, Entity>(
        tableName: TableName,
        columns: DbTableDefinition<Entity>
    ): <Alias extends string>(alias: Alias) => AliasedTable<Alias, `${TableName} as ${Alias}`, Entity> {
        return <Alias extends string>(alias: Alias) => Db.defineDbTable<TableName, Alias, Entity>(SQL.escapeId(tableName) as TableName, alias, columns);
    }

    public static defineDbTable<TableName extends string, Alias extends string, Entity>(
        escapedTableName: TableName,
        alias: string,
        columns: DbTableDefinition<Entity>
    ): AliasedTable<Alias, `${TableName} as ${Alias}`, Entity> {
        const tbl: AliasedTable<Alias, `${TableName} as ${Alias}`, Entity> = {
            [Db.SQL_EXPRESSION]: escapedTableName + " as " + SQL.escapeId(alias)
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
