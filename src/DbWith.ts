import {AliasedTable, CheckIfAliasIsAlreadyUsed, R} from "./Types";
import {DbSelect} from "./DbSelect";
import {Db} from "./Db";
import {SQL} from "./SQL";


export class DbWith<UsedAliases, UsedTables> {

    private _withQueries: Map<string, string> = new Map()
    private readonly db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    public with<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns>>
    ): DbWith<UsedAliases & R<Alias>, UsedTables & R<TableRef>> {
        if (typeof table === "string") {
            throw new Error("Invalid table argument!")
        }
        const alias = table[Db.SQL_ALIAS]
        this._withQueries.set(alias, SQL.escapeId(alias) + " AS " + table[Db.SQL_EXPRESSION])
        return this as any;
    }

    public select(): DbSelect<{}, {}, UsedAliases, {}, UsedTables, unknown> {
        return new DbSelect(this.db, this._withQueries)
    }

}
