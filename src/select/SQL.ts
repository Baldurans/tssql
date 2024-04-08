import {S0From} from "./parts/S0From";
import {SelectBuilder} from "./SelectBuilder";
import {AliasedTable, Key, NotUsingWithPart, PrepareQueryArgument, SqlQuery} from "../Types";
import {S0Uses} from "./parts/S0Uses";
import {S0With} from "./parts/S0With";
import {S7Exec} from "./parts/S7Exec";
import {S0Union} from "./parts/S0Union";
import {SQL_ENTITY} from "../Symbols";

export class SQL {

    public static select(): S0From<{}, {}, {}> {
        return new S0From(new SelectBuilder()) as any
    }

    public static uses<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, object, NotUsingWithPart>
    ): S0Uses<Key<Alias>, Key<TableRef>> {
        return new S0Uses(new SelectBuilder());
    }

    public static with<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, object, NotUsingWithPart>
    ): S0With<Key<Alias>> {
        return new S0With(new SelectBuilder()).with(table as any);
    }

    public static union<Result>(table: S7Exec<Result>): S0Union<Result> {
        return new S0Union<Result>(new SelectBuilder()).all(table as any);
    }

    public static prepare<PrepareQueryArguments extends { [key: string]: any }, Result>(func: (args: PrepareQueryArguments) => S7Exec<Result>): (args: PrepareQueryArguments) => SqlQuery<Result> {
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
        return (args: PrepareQueryArguments) => {
            return {
                [SQL_ENTITY]: undefined,
                toString: (): string => {
                    // @TODO Replace arguments!
                    return getSqlString()
                },
            }
        }
    }
}
