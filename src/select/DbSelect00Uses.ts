import {AliasedTable, CheckIfAliasIsAlreadyUsed, NOT_REFERENCED, TrueRecord} from "../Types";
import {DbSelect01From} from "./DbSelect01From";
import {DbSelect} from "./DbSelect";

export class DbSelect00Uses<UsedAliases, UsedTables, CTX> extends DbSelect<CTX> {

    public uses<
        TableName extends string,
        Alias extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>>
    ): DbSelect00Uses<UsedAliases & TrueRecord<Alias>, UsedTables & TrueRecord<TableRef>, CTX> {
        // This does nothing, it used only for Typescript type referencing.
        return this as any;
    }

    public select(): DbSelect01From<UsedAliases, {}, UsedTables, {}, CTX> {
        return new DbSelect01From(this.builder)
    }

}