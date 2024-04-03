import {AliasedTable, CheckIfAliasIsAlreadyUsed, NOT_REFERENCED, R} from "./Types";
import {SQL} from "./SQL";
import {Db} from "./Db";
import {DbSelectJoin} from "./DbSelectJoins";
import {DbSelect} from "./DbSelect";

export class DbSelectFrom<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType> extends DbSelect {

    public from<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>>
    ): DbSelectJoin<Result, UsedAliases & R<Alias>, WithAliases, Tables & R<TableRef>, UsedTables> {
        if (typeof table === "string") { // This is pretty much to satisfy typescript issue, not really needed for practical purposes.
            throw new Error("Invalid argument! Got '" + typeof table + "'")
        }
        this.parts._from = table[Db.SQL_EXPRESSION] + " as " + SQL.escapeId(table[Db.SQL_ALIAS]);
        return new DbSelectJoin(this.db, this.parts);
    }

    public forUpdate(): this {
        this.parts._forUpdate = true;
        return this;
    }

    public distinct(): this {
        this.parts._distinct = true;
        return this;
    }
}
