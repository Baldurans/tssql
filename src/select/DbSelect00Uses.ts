import {AliasedTable, isAliasAlreadyUsed, NotUsingWithPart} from "../Types";
import {DbSelect01From} from "./DbSelect01From";
import {DbSelect} from "./DbSelect";

export class DbSelect00Uses<Aliases, Tables, CTX> extends DbSelect<CTX> {

    public uses<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`
    >(
        table: isAliasAlreadyUsed<Aliases, Alias, AliasedTable<Alias, TableRef, any, NotUsingWithPart>>
    ): DbSelect00Uses<Aliases | Alias, Tables | TableRef, CTX> {
        // This does nothing, it used only for Typescript type referencing.
        return this as any;
    }

    public select(): DbSelect01From<Aliases, never, Tables, CTX> {
        return new DbSelect01From(this.builder)
    }

}
