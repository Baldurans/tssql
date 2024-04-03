import {AliasedTable, CheckIfAliasIsAlreadyUsed, NOT_REFERENCED, R} from "../Types";
import {Db} from "../Db";
import {SQL} from "../SQL";
import {DbSelect01From} from "./DbSelect01From";
import {DbSelect} from "./DbSelect";

export class DbSelect00With<UsedAliases, UsedTables> extends DbSelect {

    public with<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>>
    ): DbSelect00With<UsedAliases & R<Alias>, UsedTables & R<TableRef>> {
        if (typeof table === "string") {
            throw new Error("Invalid table argument!")
        }
        const alias = table[Db.SQL_ALIAS]
        this.builder._withQueries.set(alias, SQL.escapeId(alias) + " AS " + table[Db.SQL_EXPRESSION])
        return this as any;
    }

    public select(): DbSelect01From<{}, UsedAliases, {}, UsedTables> {
        return new DbSelect01From(this.builder)
    }

}
