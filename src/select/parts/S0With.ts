import {AliasedTable, AnyAliasedTableDef, isAliasAlreadyUsed, Key, NotUsingWithPart} from "../../Types";
import {SelectQueryPart} from "../SelectQueryPart";
import {S1Join} from "./S1Join";
import {SelectBuilder} from "../SelectBuilder";

export class S0With<AliasesFromWith> extends SelectQueryPart {

    public with<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`,
        Columns
    >(
        table: isAliasAlreadyUsed<AliasesFromWith, Alias, AliasedTable<Alias, TableRef, Columns, NotUsingWithPart>>
    ): S0With<AliasesFromWith & Key<Alias>> {
        this.builder.with(table as AnyAliasedTableDef);
        return this as any;
    }

    public selectFrom<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, object, string | NotUsingWithPart>
    ): S1Join<Key<Alias>, AliasesFromWith, Key<TableRef>> {
        return new S1Join(new SelectBuilder().from(table));
    }

}
