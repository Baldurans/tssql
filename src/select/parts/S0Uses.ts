import {AliasedTable, isAliasAlreadyUsed, Key, NotUsingWithPart} from "../../Types";
import {getJoinMethods, JoinStep} from "./S1Join";
import {SelectBuilder} from "../SelectBuilder";
import {getColumnMethods} from "./S2Columns";

export function getUsesMethods<Aliases, Tables>(builder: SelectBuilder): UsesMethods<Aliases, Tables> {
    return {
        uses: (...items: any) => {
            return getUsesMethods(builder)
        },
        selectFrom: (table: any) => {
            const builder = new SelectBuilder().from(table);
            return {
                ...getColumnMethods(builder),
                ...getJoinMethods(builder)
            } as any
        }
    }
}

export interface UsesMethods<Aliases, Tables> {

    uses<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`
    >(
        table: isAliasAlreadyUsed<Aliases, Alias, AliasedTable<Alias, TableRef, any, NotUsingWithPart>>
    ): UsesMethods<Aliases & Key<Alias>, Tables & Key<TableRef>>


    selectFrom<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, object, string | NotUsingWithPart>
    ): JoinStep<Aliases & Key<Alias>, {}, Tables & Key<TableRef>>

}
