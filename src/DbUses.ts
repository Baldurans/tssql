import {AliasedTable, CheckIfAliasIsAlreadyUsed, R} from "./Types";
import {DbSelect} from "./DbSelect";
import {Db} from "./Db";


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
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns>>
    ): DbUses<UsedAliases & R<Alias>, UsedTables & R<TableRef>>
    public uses(table: any): any {
        // This does nothing, it used only for Typescript type referencing.
        return this;
    }

    public select(): DbSelect<{}, UsedAliases, {}, UsedTables, UsedTables, unknown> {
        return new DbSelect(this.db)
    }

}
