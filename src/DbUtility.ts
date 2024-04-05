import {AliasedTable, NOT_REFERENCED} from "./Types";
import {SqlExpression} from "./SqlExpression";
import {DbTableDefinition} from "./Db";

export class DbUtility {

    public static readonly SQL_EXPRESSION = Symbol("Table expression")
    public static readonly SQL_ALIAS = Symbol("Alias")
    public static readonly SQL_REF_ALIAS = Symbol("RefAlias")

    public static defineDbTable<TableName extends string, Alias extends string, Entity>(
        escapedExpression: TableName,
        alias: string,
        columns: DbTableDefinition<Entity>
    ): AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NOT_REFERENCED> {
        const tbl: AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NOT_REFERENCED> = {
            [DbUtility.SQL_EXPRESSION]: escapedExpression,
            [DbUtility.SQL_ALIAS]: alias,
            //createRef: (table: any, newAlias: any) => this.createRef(table, newAlias)
        } as any;
        DbUtility.testIfOkaySqlStringOrThrow(alias);
        for (const columnName in columns) {
            DbUtility.testIfOkaySqlStringOrThrow(columnName);
            (tbl as any)[columnName] = new SqlExpression(alias + "." + columnName, columnName, undefined)
        }
        Object.freeze(tbl)
        return tbl
    }

    public static isOkaySqlString(value: unknown): boolean {
        return typeof value === "string" && value.length > 0 && /^[A-Za-z_][A-Za-z0-9_]*$/.test(value)
    }

    public static testIfOkaySqlStringOrThrow(value: unknown): void {
        if (!this.isOkaySqlString(value)) {
            throw new Error("Invalid SQL string '" + value + "'")
        }
    }
}