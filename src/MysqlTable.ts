import {AliasedTable, DbTableDefinition, NotUsingWithPart} from "./Types";
import {escape, escapeId} from "./escape";
import {SQL_ALIAS, SQL_EXPRESSION} from "./Symbols";
import {SqlExpression} from "./SqlExpression";

export type WhereArgs<Entity> = {
    [K in keyof Entity]?: Entity[K]
}

export class MysqlTable<TableName extends string, Entity> {

    public readonly tableName: TableName;
    private readonly columns: DbTableDefinition<Entity>;
    private readonly cache: Map<string, AliasedTable<string, `${TableName} as ${string}`, Entity, NotUsingWithPart>> = new Map();

    constructor(tableName: TableName, columns: DbTableDefinition<Entity>) {
        this.tableName = tableName;
        this.columns = columns;
        Object.freeze(this.columns);
    }

    public as<Alias extends string>(alias: Alias): AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NotUsingWithPart> {
        if (!this.cache.has(alias)) {
            this.cache.set(alias, MysqlTable.defineDbTable<TableName, Alias, Entity>(escapeId(this.tableName) as TableName, alias, this.columns))
        }
        return this.cache.get(alias) as AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NotUsingWithPart>
    }

    /**
     * Returns query that checks existence of a row. Returns [{exists: 1}] if row exists and no rows if it doesn't.
     */
    public exists(args: WhereArgs<Entity>): string {
        const where: string[] = [];
        for (const key in args) {
            where.push(escapeId(key) + "=" + escape(args[key] as any))
        }
        return "SELECT 1 as exists FROM " + escapeId(this.tableName) + " WHERE " + where.join(" AND ");
    }

    public toString(): string {
        return this.tableName;
    }

    /**
     * Define a table structure with alias.
     */
    public static defineDbTable<TableName extends string, Alias extends string, Entity>(
        escapedExpression: TableName,
        alias: string,
        columns: DbTableDefinition<Entity>
    ): AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NotUsingWithPart> {
        const tbl: AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NotUsingWithPart> = {
            [SQL_EXPRESSION]: escapedExpression,
            [SQL_ALIAS]: alias
        } as any;
        for (const columnName in columns) {
            (tbl as any)[columnName] = new SqlExpression(escapeId(alias) + "." + escapeId(columnName), columnName)
        }
        Object.freeze(tbl)
        return tbl
    }

}