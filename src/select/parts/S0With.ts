import {AliasedTable, isAliasAlreadyUsed, Key, NotUsingWithPart} from "../../Types";
import {JoinMethods} from "./S1Join";

export interface WithMethods<AliasesFromWith> {

    with<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`,
        Columns
    >(
        table: isAliasAlreadyUsed<AliasesFromWith, Alias, AliasedTable<Alias, TableRef, Columns, NotUsingWithPart>>
    ): WithMethods<AliasesFromWith & Key<Alias>>

    selectFrom<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, object, string | NotUsingWithPart>
    ): JoinMethods<Key<Alias>, AliasesFromWith, Key<TableRef>>

}

