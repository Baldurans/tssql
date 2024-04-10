import {AliasedTable, DbTableDefinition, ExecuteSqlQuery, InsertRow, NotUsingWithPart} from "./Types";
import {escape, escapeId} from "./escape";
import {SQL_ALIAS, SQL_EXPRESSION} from "./Symbols";
import {SqlExpression} from "./SqlExpression";
import {DeleteBuilder} from "./delete/DeleteBuilder";
import {ExecInsertMethods} from "./insert/InsertInterfaces";
import {InsertBuilder} from "./insert/InsertBuilder";
import {GatewayDeleteOrderByMethods} from "./delete/DeleteInterfaces";
import {UpdateBuilder} from "./update/UpdateBuilder";
import {GatewayUpdateWhereMethods} from "./update/UpdateInterfaces";

export type WhereArgs<Entity> = {
    [K in keyof Entity]?: Entity[K]
}

export class MysqlTable<TableName extends string, Entity, EditEntity, CTX> {

    public readonly tableName: TableName;
    private readonly columns: DbTableDefinition<Entity>;
    private readonly cache: Map<string, AliasedTable<string, `${TableName} as ${string}`, Entity, NotUsingWithPart>> = new Map();
    private readonly executor: ExecuteSqlQuery<CTX> = undefined

    constructor(tableName: TableName, columns: DbTableDefinition<Entity>, executor?: ExecuteSqlQuery<CTX>) {
        this.tableName = tableName;
        this.columns = columns;
        this.executor = executor;
        Object.freeze(this.columns);
    }

    public as<Alias extends string>(alias: Alias): AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NotUsingWithPart> {
        if (!this.cache.has(alias)) {
            this.cache.set(alias, MysqlTable.defineDbTable<TableName, Alias, Entity>(escapeId(this.tableName) as TableName, alias, this.columns))
        }
        return this.cache.get(alias) as AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NotUsingWithPart>
    }

    public deleteWhere(where: Partial<Entity>): GatewayDeleteOrderByMethods<Entity> {
        const builder = new DeleteBuilder().from(this.tableName, undefined)
        for (const prop in where) {
            builder.where(escapeId(prop) + " = " + escape((where as any)[prop]));
        }
        return builder
    }

    public insert(row: InsertRow<EditEntity, Entity>): ExecInsertMethods {
        return new InsertBuilder().to(this.tableName).set(row)
    }

    public update(row: Partial<InsertRow<EditEntity, Entity>>): GatewayUpdateWhereMethods<Entity, CTX> {
        return new UpdateBuilder(this.executor).in(this.tableName).set(row)
    }

    /**
     * Returns query that checks existence of a row. Returns [{res: 1}] if at least one row exists and no rows if it doesn't.
     */
    public exists(args: WhereArgs<Entity>): string {
        const where: string[] = [];
        for (const key in args) {
            where.push(escapeId(key) + "=" + escape(args[key] as any))
        }
        return "SELECT 1 as res FROM " + escapeId(this.tableName) + " WHERE " + where.join(" AND ") + " LIMIT 1";
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