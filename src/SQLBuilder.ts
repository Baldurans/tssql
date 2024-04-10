import {SelectBuilder} from "./select/SelectBuilder";
import {AliasedTable, DbTableDefinition, ExecuteSqlQuery, Key, NotUsingWithPart, PrepareQueryArgument, SqlQuery} from "./Types";
import {SQL_ALIAS, SQL_ENTITY, SQL_EXPRESSION} from "./Symbols";
import {escape, escapeId} from "./escape";
import {MysqlTable} from "./MysqlTable";
import {JoinMethods} from "./select/parts/S1Join";
import {UsesMethods} from "./select/parts/S0Uses";
import {WithMethods} from "./select/parts/S0With";
import {ExecMethods} from "./select/parts/S7Exec";
import {DeleteBuilder} from "./delete/DeleteBuilder";
import {DeleteWhereMethods} from "./delete/DeleteInterfaces";

export class SQLBuilder<CTX> {

    private readonly executor: ExecuteSqlQuery<CTX> = undefined

    constructor(executor: ExecuteSqlQuery<CTX>) {
        this.executor = executor;
    }

    public insertInto() {

    }

    public update() {

    }

    public deleteFrom<
        Alias extends string = never,
        TableRef extends `${string} as ${Alias}` = never,
    >(
        table: AliasedTable<Alias, TableRef, object, string | NotUsingWithPart>
    ): DeleteWhereMethods<Key<TableRef>> {
        return new DeleteBuilder().from(table[SQL_EXPRESSION], table[SQL_ALIAS]);
    }

    public selectFrom<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, object, string | NotUsingWithPart>
    ): JoinMethods<Key<Alias>, {}, Key<TableRef>, CTX> {
        return new SelectBuilder(this.executor).selectFrom(table)
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
    public uses<
        Alias1 extends string, TableRef1 extends `${string} as ${Alias1}`,
    >(
        table1: AliasedTable<Alias1, TableRef1, object, NotUsingWithPart>
    ): UsesMethods<Key<Alias1>, Key<TableRef1>, CTX>
    public uses<
        Alias1 extends string, TableRef1 extends `${string} as ${Alias1}`,
        Alias2 extends string, TableRef2 extends `${string} as ${Alias2}`,
    >(
        table1: AliasedTable<Alias1, TableRef1, object, NotUsingWithPart>,
        table2: AliasedTable<Alias2, TableRef2, object, NotUsingWithPart>,
    ): UsesMethods<Key<Alias1> & Key<Alias2>, Key<TableRef1> & Key<TableRef2>, CTX>
    public uses<
        Alias1 extends string, TableRef1 extends `${string} as ${Alias1}`,
        Alias2 extends string, TableRef2 extends `${string} as ${Alias2}`,
        Alias3 extends string, TableRef3 extends `${string} as ${Alias3}`
    >(
        table1: AliasedTable<Alias1, TableRef1, object, NotUsingWithPart>,
        table2: AliasedTable<Alias2, TableRef2, object, NotUsingWithPart>,
        table3: AliasedTable<Alias3, TableRef3, object, NotUsingWithPart>,
    ): UsesMethods<Key<Alias1> & Key<Alias2> & Key<Alias3>, Key<TableRef1> & Key<TableRef2> & Key<TableRef3>, CTX>
    public uses<
        Alias1 extends string, TableRef1 extends `${string} as ${Alias1}`,
        Alias2 extends string, TableRef2 extends `${string} as ${Alias2}`,
        Alias3 extends string, TableRef3 extends `${string} as ${Alias3}`,
        Alias4 extends string, TableRef4 extends `${string} as ${Alias4}`,
    >(
        table1: AliasedTable<Alias1, TableRef1, object, NotUsingWithPart>,
        table2: AliasedTable<Alias2, TableRef2, object, NotUsingWithPart>,
        table3: AliasedTable<Alias3, TableRef3, object, NotUsingWithPart>,
        table4: AliasedTable<Alias4, TableRef4, object, NotUsingWithPart>,
    ): UsesMethods<Key<Alias1> & Key<Alias2> & Key<Alias3> & Key<Alias4>, Key<TableRef1> & Key<TableRef2> & Key<TableRef3> & Key<TableRef4>, CTX>
    public uses(table1: any, table2?: any, table3?: any, table4?: any) {
        return new SelectBuilder(this.executor);
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
    public with<
        Alias1 extends string, TableRef1 extends `${string} as ${Alias1}`,
    >(
        table1: AliasedTable<Alias1, TableRef1, object, NotUsingWithPart>
    ): WithMethods<Key<Alias1>, CTX>
    public with<
        Alias1 extends string, TableRef1 extends `${string} as ${Alias1}`,
        Alias2 extends string, TableRef2 extends `${string} as ${Alias2}`,
    >(
        table1: AliasedTable<Alias1, TableRef1, object, NotUsingWithPart>,
        table2: AliasedTable<Alias2, TableRef2, object, NotUsingWithPart>,
    ): WithMethods<Key<Alias1> & Key<Alias2>, CTX>
    public with<
        Alias1 extends string, TableRef1 extends `${string} as ${Alias1}`,
        Alias2 extends string, TableRef2 extends `${string} as ${Alias2}`,
        Alias3 extends string, TableRef3 extends `${string} as ${Alias3}`
    >(
        table1: AliasedTable<Alias1, TableRef1, object, NotUsingWithPart>,
        table2: AliasedTable<Alias2, TableRef2, object, NotUsingWithPart>,
        table3: AliasedTable<Alias3, TableRef3, object, NotUsingWithPart>,
    ): WithMethods<Key<Alias1> & Key<Alias2> & Key<Alias3>, CTX>
    public with<
        Alias1 extends string, TableRef1 extends `${string} as ${Alias1}`,
        Alias2 extends string, TableRef2 extends `${string} as ${Alias2}`,
        Alias3 extends string, TableRef3 extends `${string} as ${Alias3}`,
        Alias4 extends string, TableRef4 extends `${string} as ${Alias4}`,
    >(
        table1: AliasedTable<Alias1, TableRef1, object, NotUsingWithPart>,
        table2: AliasedTable<Alias2, TableRef2, object, NotUsingWithPart>,
        table3: AliasedTable<Alias3, TableRef3, object, NotUsingWithPart>,
        table4: AliasedTable<Alias4, TableRef4, object, NotUsingWithPart>,
    ): WithMethods<Key<Alias1> & Key<Alias2> & Key<Alias3> & Key<Alias4>, CTX>
    public with(table: any) {
        return new SelectBuilder(this.executor).with(table);
    }

    /**
     * Creates a prepared query.
     *
     * Prepared query is a fixed query that will be prebuilt for higher performance. It will only replace arguments in a prebuilt SQL query string.
     * Main drawback of this is that query has to be and can't have anything dynamic in it.
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
    public prepare<PrepareQueryArguments extends { [key: string]: any }, Result>(func: (args: PrepareQueryArguments) => ExecMethods<Result, CTX>): (args: PrepareQueryArguments) => SqlQuery<Result> {
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
    public createRef<
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
