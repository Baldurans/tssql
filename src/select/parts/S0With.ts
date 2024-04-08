import {AliasedTable, AnyAliasedTableDef, isAliasAlreadyUsed, Key, NotUsingWithPart} from "../../Types";
import {S0From} from "./S0From";
import {SelectQueryPart} from "../SelectQueryPart";

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

    public select(): S0From<{}, AliasesFromWith, {}> {
        return new S0From(this.builder)
    }

}
