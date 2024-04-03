import {SQL} from "../SQL";
import {Db} from "../Db";
import {DbSelectJoin} from "./DbSelectJoins";
import {DbSelect} from "./DbSelect";
import {AliasedTable, NOT_REFERENCED, R} from "../Types";

export class DbSelectFrom<UsedAliases, WithAliases, Tables, UsedTables> extends DbSelect {

    public from<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>
    ): DbSelectJoin<UsedAliases & R<Alias>, WithAliases, Tables & R<TableRef>, UsedTables> {
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

}
