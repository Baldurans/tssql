import {S0From} from "./select/parts/S0From";
import {SelectBuilder} from "./select/SelectBuilder";
import {AliasedTable, DbTableDefinition, Key, NotUsingWithPart, PrepareQueryArgument, SqlQuery} from "./Types";
import {S0Uses} from "./select/parts/S0Uses";
import {S0With} from "./select/parts/S0With";
import {S7Exec} from "./select/parts/S7Exec";
import {S0Union} from "./select/parts/S0Union";
import {SQL_ALIAS, SQL_ENTITY} from "./Symbols";
import {escape, escapeId} from "./escape";
import {MysqlTable} from "./MysqlTable";

export class SQL {

    /**
     * Start building a select query.
     */
    public static select(): S0From<{}, {}, {}> {
        return new S0From(new SelectBuilder()) as any
    }

    /**
     * Start building a select query that most probably will be used as a scalar subquery.
     *
     * for example:
     * SELECT
     *    (SELECT id FROM child WHERE child.id = parent.id ) <--- scalar subquery
     * FROM parent
     *
     * In the uses part you add parent table refererence.
     */
    public static uses<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, object, NotUsingWithPart>
    ): S0Uses<Key<Alias>, Key<TableRef>> {
        return new S0Uses(new SelectBuilder());
    }

    /**
     * Start building a select query that uses WITH queries.
     *
     * for example:
     * WITH user2 AS (
     *      SELECT id FROM user <-- this query AliasedTable is argument to this method. ( SQL.select()...as("user2") )
     * )
     * SELECT *
     * FROM user2
     *
     * With a
     */
    public static with<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, object, NotUsingWithPart>
    ): S0With<Key<Alias>> {
        return new S0With(new SelectBuilder()).with(table as any);
    }

    /**
     * Creates a union query.
     */
    public static union<Result>(table: S7Exec<Result>): S0Union<Result> {
        return new S0Union<Result>(new SelectBuilder()).all(table as any);
    }

    /**
     * Creates a prepared query.
     *
     * Prepared query is a fixed query that will be prebuilt for higher performance. It will only replace arguments in a prebuilt SQL query string.
     * Main drawback of this is that query has to be static and can't have anything dynamic in it.
     *
     * This is not Mysql prepared statement, it is only preparing and caching a string of the SQL query.
     *
     * Usage
     *
     * const prepared = SQL.prepare( ( args:{id: number} ) => {
     *     const c = MyDb.user("c");
     *     return SQL.select().from(c)...where( c.id.eq(args.id).noLimit()
     * })
     *
     * exec(prepared({id: 10}))
     *
     */
    public static prepare<PrepareQueryArguments extends { [key: string]: any }, Result>(func: (args: PrepareQueryArguments) => S7Exec<Result>): (args: PrepareQueryArguments) => SqlQuery<Result> {
        let sqlQuery: string = undefined;
        const seenArguments: Map<string, string> = new Map();
        const getSqlString = () => {
            if (sqlQuery === undefined) {
                const p: PrepareQueryArguments = new Proxy({}, {
                    get(_: {}, p: string): PrepareQueryArgument {
                        if (!/^[A-Za-z]+$/.test(p)) {
                            throw new Error("Invalid prepare query argument named '" + p + "'. Can only contain ascii letters!")
                        }
                        const variable = "<<|_arg:|>>" + p + "<<|:_arg|>>";
                        seenArguments.set(p, variable);
                        return {__prepare_argument: true, expression: variable};
                    }
                }) as any
                sqlQuery = func(p).toString();
            }
            return sqlQuery;
        }
        return (args: PrepareQueryArguments) => {
            return {
                [SQL_ENTITY]: undefined,
                toString: (): string => {
                    let usedQuery = getSqlString();
                    seenArguments.forEach((variable, key) => {
                        usedQuery = usedQuery.replace(variable, escape(args[key]));
                    })
                    return usedQuery
                },
            }
        }
    }

    /**
     * Create a reference for a query that is used in WITH part and you want to use it in from(X) or join(X) call.
     */
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
        return MysqlTable.defineDbTable(escapeId(table[SQL_ALIAS]), newAlias, definition) as any;
    }

}

