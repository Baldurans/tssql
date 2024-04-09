import {AliasedTable, isAliasAlreadyUsed, Key, NotUsingWithPart} from "../../Types";
import {SelectQueryPart} from "../SelectQueryPart";
import {S1Join} from "./S1Join";
import {SelectBuilder} from "../SelectBuilder";

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

    public selectFrom<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, object, string | NotUsingWithPart>
    ): S1Join<Aliases & Key<Alias>, {}, Tables & Key<TableRef>> {
        return new S1Join(new SelectBuilder().from(table));
    }

}
