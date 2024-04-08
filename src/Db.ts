import {AliasedTable, Key, NotUsingWithPart, PrepareQueryArgument} from "./Types";
import {DbSelect00Uses} from "./select/DbSelect00Uses";
import {DbSelect00With} from "./select/DbSelect00With";
import {DbSelectBuilder} from "./select/DbSelectBuilder";
import {DbSelect01From} from "./select/DbSelect01From";
import {DbSelect00Union} from "./select/DbSelect00Union";
import {DbSelect09Exec} from "./select/DbSelect09Exec";
import {SqlExpression} from "./SqlExpression";
import {Sql} from "./Sql";
import {SQL_ALIAS, SQL_EXPRESSION} from "./Symbols";

export type DbExecFunc<CTX> = (ctx: CTX, sql: string, args?: { [key: string]: string | number }) => Promise<any[]>;

export abstract class Db<CTX> {

    constructor(private readonly exec: DbExecFunc<CTX>) {

    }

    // -------------------------------------------------------

    public select(): DbSelect01From<{}, {}, {}, CTX> {
        return new DbSelect01From(new DbSelectBuilder<CTX>(this.exec)) as any
    }

    public uses<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, object, NotUsingWithPart>
    ): DbSelect00Uses<Key<Alias>, Key<TableRef>, CTX> {
        return new DbSelect00Uses(new DbSelectBuilder<CTX>(this.exec));
    }

    public with<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, object, NotUsingWithPart>
    ): DbSelect00With<Key<Alias>, CTX> {
        return new DbSelect00With(new DbSelectBuilder<CTX>(this.exec)).with(table as any);
    }

    public union<Result>(table: DbSelect09Exec<Result, CTX>): DbSelect00Union<Result, CTX> {
        return new DbSelect00Union<Result, CTX>(new DbSelectBuilder<CTX>(this.exec)).all(table as any);
    }

    public prepare<PrepareQueryArguments extends { [key: string]: any }, Result>(func: (args: PrepareQueryArguments) => DbSelect09Exec<Result, CTX>): {
        exec: (ctx: CTX, args: PrepareQueryArguments) => Promise<Result[]>,
        execOne: (ctx: CTX, args: PrepareQueryArguments) => Promise<Result | undefined>
    } {
        let sqlQuery: string = undefined;
        const getSqlString = () => {
            if (sqlQuery === undefined) {
                const p: PrepareQueryArguments = new Proxy({}, {
                    get(_: {}, p: string): PrepareQueryArgument {
                        if (!/^[A-Za-z]+$/.test(p)) {
                            throw new Error("Invalid prepare query argument named '" + p + "'. Can only contain ascii letters!")
                        }
                        return {__prepare_argument: true, expression: ":" + p};
                    }
                }) as any
                sqlQuery = func(p).toString();
            }
            console.log(sqlQuery)
            return sqlQuery;
        }
        return {
            exec: async (ctx: CTX, args: PrepareQueryArguments): Promise<Result[]> => {
                return this.exec(ctx, getSqlString(), args)
            },
            execOne: async (ctx: CTX, args: PrepareQueryArguments): Promise<Result | undefined> => {
                return (await this.exec(ctx, getSqlString(), args))?.[0]
            }
        }
    }

    // -------------------------------------------------------

    public static createRef<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`,
        Entity,
        NewAlias extends string
    >(table: AliasedTable<Alias, TableRef, Entity, NotUsingWithPart>, newAlias: NewAlias): AliasedTable<NewAlias, `${Alias} as ${NewAlias}`, Entity, Alias> {
        const definition: DbTableDefinition<Entity> = {} as any;
        for (const k in table) {
            (definition as any)[k] = (table as any)[k];
        }
        return Db.defineDbTable(Sql.escapeId(table[SQL_ALIAS]), newAlias, definition) as any;
    }

    public static getDbTableAliasFunction<TableName extends string, Entity>(
        tableName: TableName,
        columns: DbTableDefinition<Entity>
    ): <Alias extends string>(alias: Alias) => AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NotUsingWithPart> {
        return <Alias extends string>(alias: Alias) => Db.defineDbTable<TableName, Alias, Entity>(Sql.escapeId(tableName) as TableName, alias, columns);
    }

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
            (tbl as any)[columnName] = new SqlExpression(Sql.escapeId(alias) + "." + Sql.escapeId(columnName), columnName)
        }
        Object.freeze(tbl)
        return tbl
    }


}

export type DbTableDefinition<T> = {
    [P in keyof T]: true
};
