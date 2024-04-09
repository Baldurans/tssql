import {AliasedTable, isAliasAlreadyUsed, Key, NotUsingWithPart} from "../../Types";
import {getJoinMethods, JoinMethods} from "./S1Join";
import {SelectBuilder} from "../SelectBuilder";

export function getWithMethods<AliasesFromWith>(builder: SelectBuilder): WithMethods<AliasesFromWith> {
    return {
        with: (table: any) => {
            builder.with(table);
            return getWithMethods(builder)
        },
        selectFrom: (table: any) => {
            builder.from(table)
            return getJoinMethods(builder)
        }
    }
}

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

