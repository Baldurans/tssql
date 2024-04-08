import {isAliasAlreadyUsed, NotUsingWithPart, Key, AliasedTable} from "../../Types";
import {S0From} from "./S0From";
import {SelectQueryPart} from "../SelectQueryPart";

export class S0Uses<Aliases, Tables> extends SelectQueryPart {

    public uses<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`
    >(
        table: isAliasAlreadyUsed<Aliases, Alias, AliasedTable<Alias, TableRef, any, NotUsingWithPart>>
    ): S0Uses<Aliases & Key<Alias>, Tables & Key<TableRef>> {
        // This does nothing, it used only for Typescript type referencing.
        return this as any;
    }

    public select(): S0From<Aliases, {}, Tables> {
        return new S0From(this.builder)
    }

}
