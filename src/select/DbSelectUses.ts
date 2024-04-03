import {AliasedTable, CheckIfAliasIsAlreadyUsed, NOT_REFERENCED, R} from "../Types";
import {DbSelectFrom} from "./DbSelectFrom";
import {DbSelectParts} from "./DbSelectParts";
import {DbSelect} from "./DbSelect";


export class DbSelectUses<UsedAliases, UsedTables> extends DbSelect {

    public uses<
        TableName extends string,
        Alias extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>>
    ): DbSelectUses<UsedAliases & R<Alias>, UsedTables & R<TableRef>> {
        // This does nothing, it used only for Typescript type referencing.
        return this as any;
    }

    public select(): DbSelectFrom<UsedAliases, {}, UsedTables, {}> {
        return new DbSelectFrom(this.db, new DbSelectParts())
    }

}
