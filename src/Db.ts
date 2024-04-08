import {AliasedTable, Key, NotUsingWithPart, PrepareQueryArgument} from "./Types";
import {S0Uses} from "./select/parts/S0Uses";
import {S0With} from "./select/parts/S0With";
import {SelectBuilder} from "./select/SelectBuilder";
import {S0From} from "./select/parts/S0From";
import {S0Union} from "./select/parts/S0Union";
import {S7Exec} from "./select/parts/S7Exec";
import {SqlExpression} from "./SqlExpression";
import {SQL_ALIAS, SQL_EXPRESSION} from "./Symbols";
import {escapeId} from "./escape";

export type DbExecFunc<CTX> = (ctx: CTX, sql: string, args?: { [key: string]: string | number }) => Promise<any[]>;

export abstract class Db<CTX> {

    constructor(private readonly exec: DbExecFunc<CTX>) {

    }

    // -------------------------------------------------------

    public select(): S0From<{}, {}, {}, CTX> {
        return new S0From(new SelectBuilder<CTX>(this.exec)) as any
    }

    public uses<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, object, NotUsingWithPart>
    ): S0Uses<Key<Alias>, Key<TableRef>, CTX> {
        return new S0Uses(new SelectBuilder<CTX>(this.exec));
    }

    public with<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, object, NotUsingWithPart>
    ): S0With<Key<Alias>, CTX> {
        return new S0With(new SelectBuilder<CTX>(this.exec)).with(table as any);
    }

    public union<Result>(table: S7Exec<Result, CTX>): S0Union<Result, CTX> {
        return new S0Union<Result, CTX>(new SelectBuilder<CTX>(this.exec)).all(table as any);
    }

    public prepare<PrepareQueryArguments extends { [key: string]: any }, Result>(func: (args: PrepareQueryArguments) => S7Exec<Result, CTX>): {
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
        return Db.defineDbTable(escapeId(table[SQL_ALIAS]), newAlias, definition) as any;
    }

    public static getDbTableAliasFunction<TableName extends string, Entity>(
        tableName: TableName,
        columns: DbTableDefinition<Entity>
    ): <Alias extends string>(alias: Alias) => AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NotUsingWithPart> {
        return <Alias extends string>(alias: Alias) => Db.defineDbTable<TableName, Alias, Entity>(escapeId(tableName) as TableName, alias, columns);
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
            (tbl as any)[columnName] = new SqlExpression(escapeId(alias) + "." + escapeId(columnName), columnName)
        }
        Object.freeze(tbl)
        return tbl
    }


}

export type DbTableDefinition<T> = {
    [P in keyof T]: true
};
