import {AliasedTable, CheckIfAliasIsAlreadyUsed, NOT_REFERENCED, R} from "./Types";
import {Db} from "./Db";
import {DbSelectFrom} from "./DbSelectFrom";
import {DbSelectParts} from "./DbSelectParts";


export class DbUses<UsedAliases, UsedTables> {

    private readonly db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    public uses<
        TableName extends string,
        Alias extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>>
    ): DbUses<UsedAliases & R<Alias>, UsedTables & R<TableRef>>
    public uses(table: any): any {
        // This does nothing, it used only for Typescript type referencing.
        return this;
    }

    public select(): DbSelectFrom<UsedAliases, {}, UsedTables, {}> {
        return new DbSelectFrom(this.db, new DbSelectParts())
    }

}
