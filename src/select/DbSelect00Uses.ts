import {AliasedTable, isAliasAlreadyUsed, NOT_REFERENCED, Key} from "../Types";
import {DbSelect01From} from "./DbSelect01From";
import {DbSelect} from "./DbSelect";

export class DbSelect00Uses<Aliases, Tables, CTX> extends DbSelect<CTX> {

    public uses<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`,
        Columns
    >(
        table: isAliasAlreadyUsed<Aliases, Alias, AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>>
    ): DbSelect00Uses<Aliases & Key<Alias>, Tables & Key<TableRef>, CTX> {
        // This does nothing, it used only for Typescript type referencing.
        return this as any;
    }

    public select(): DbSelect01From<Aliases, {}, Tables, CTX> {
        return new DbSelect01From(this.builder)
    }

}
