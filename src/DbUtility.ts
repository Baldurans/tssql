import {AliasedTable, NotUsingWithPart} from "./Types";
import {SqlExpression} from "./SqlExpression";
import {Sql} from "./Sql";
import {DbTableDefinition} from "./Db";

export class DbUtility {

    public static readonly SQL_EXPRESSION = Symbol("Table expression")
    public static readonly SQL_ALIAS = Symbol("Alias")
    public static readonly SQL_ALIAS_FOR_WITH_QUERY = Symbol("RefAlias")
    public static readonly SQL_ENTITY = Symbol("Entity")

    public static defineDbTable<TableName extends string, Alias extends string, Entity>(
        escapedExpression: TableName,
        alias: string,
        columns: DbTableDefinition<Entity>
    ): AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NotUsingWithPart> {
        const tbl: AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NotUsingWithPart> = {
            [DbUtility.SQL_EXPRESSION]: escapedExpression,
            [DbUtility.SQL_ALIAS]: alias,
            //createRef: (table: any, newAlias: any) => this.createRef(table, newAlias)
        } as any;
        for (const columnName in columns) {
            (tbl as any)[columnName] = new SqlExpression(Sql.escapeId(alias) + "." + Sql.escapeId(columnName), columnName)
        }
        Object.freeze(tbl)
        return tbl
    }

}