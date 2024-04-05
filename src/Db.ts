import {Sql} from "./Sql";
import {AliasedTable, Key, NotUsingWithPart, PrepareQueryArgument} from "./Types";
import {DbSelect00Uses} from "./select/DbSelect00Uses";
import {DbSelect00With} from "./select/DbSelect00With";
import {DbSelectBuilder} from "./select/DbSelectBuilder";
import {DbSelect01From} from "./select/DbSelect01From";
import {DbUtility} from "./DbUtility";
import {DbSelect00Union} from "./select/DbSelect00Union";
import {DbSelect09Exec} from "./select/DbSelect09Exec";


export abstract class Db<CTX> {

    constructor(private readonly exec: (ctx: CTX, sql: string, args?: { [key: string]: string | number }) => Promise<any[]>) {

    }

    public select(): DbSelect01From<"", "", {}, CTX> {
        return new DbSelect01From(new DbSelectBuilder<CTX>(this.exec)) as any
    }

    public uses<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, any, NotUsingWithPart>
    ): DbSelect00Uses<Alias, Key<TableRef>, CTX> {
        return new DbSelect00Uses(new DbSelectBuilder<CTX>(this.exec));
    }

    public with<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, any, NotUsingWithPart>
    ): DbSelect00With<Alias, CTX> {
        return new DbSelect00With<Alias, CTX>(new DbSelectBuilder<CTX>(this.exec)).with(table as any);
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
                        return {__prepare_argument: true, name: p};
                    }
                }) as any
                sqlQuery = func(p).toString();
            }
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

    public static createRef<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Entity,
        NewAlias extends string
    >(table: AliasedTable<Alias, TableRef, Entity, NotUsingWithPart>, newAlias: NewAlias): AliasedTable<NewAlias, `${TableName} as ${NewAlias}`, Entity, Alias> {
        const definition: DbTableDefinition<Entity> = {} as any;
        for (const k in table) {
            (definition as any)[k] = (table as any)[k];
        }
        return DbUtility.defineDbTable(Sql.escapeId(table[DbUtility.SQL_ALIAS]), newAlias, definition) as any;
    }

    protected getDbTableAliasFunction<TableName extends string, Entity>(
        tableName: TableName,
        columns: DbTableDefinition<Entity>
    ): <Alias extends string>(alias: Alias) => AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, NotUsingWithPart> {
        return <Alias extends string>(alias: Alias) => DbUtility.defineDbTable<TableName, Alias, Entity>(Sql.escapeId(tableName) as TableName, alias, columns);
    }

}

export type DbTableDefinition<T> = {
    [P in keyof T]: true
};
