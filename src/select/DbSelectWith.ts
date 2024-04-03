import {AliasedTable, CheckIfAliasIsAlreadyUsed, NOT_REFERENCED, R} from "../Types";
import {Db} from "../Db";
import {SQL} from "../SQL";
import {DbSelectFrom} from "./DbSelectFrom";
import {DbSelect} from "./DbSelect";

export class DbSelectWith<UsedAliases, UsedTables> extends DbSelect {

    public with<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>>
    ): DbSelectWith<UsedAliases & R<Alias>, UsedTables & R<TableRef>> {
        if (typeof table === "string") {
            throw new Error("Invalid table argument!")
        }
        const alias = table[Db.SQL_ALIAS]
        this.parts._withQueries.set(alias, SQL.escapeId(alias) + " AS " + table[Db.SQL_EXPRESSION])
        return this as any;
    }

    public select(): DbSelectFrom<{}, UsedAliases, {}, UsedTables> {
        return new DbSelectFrom(this.db, this.parts)
    }

}
