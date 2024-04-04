import {AliasedTable, CheckIfAliasIsAlreadyUsed, NOT_REFERENCED, TrueRecord} from "../Types";
import {DbSelect01From} from "./DbSelect01From";
import {DbSelect} from "./DbSelect";

export class DbSelect00Uses<Aliases, Tables, CTX> extends DbSelect<CTX> {

    public uses<
        TableName extends string,
        Alias extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: CheckIfAliasIsAlreadyUsed<Aliases, Alias, AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>>
    ): DbSelect00Uses<Aliases & TrueRecord<Alias>, Tables & TrueRecord<TableRef>, CTX> {
        // This does nothing, it used only for Typescript type referencing.
        return this as any;
    }

    public select(): DbSelect01From<Aliases, {}, Tables, CTX> {
        return new DbSelect01From(this.builder)
    }

}
