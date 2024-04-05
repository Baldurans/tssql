import {AliasedTable, AnyAliasedTableDef, isAliasAlreadyUsed, NotUsingWithPart} from "../Types";
import {DbSelect01From} from "./DbSelect01From";
import {DbSelect} from "./DbSelect";

export class DbSelect00With<AliasesFromWith, CTX> extends DbSelect<CTX> {

    public with<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`,
        Columns
    >(
        table: isAliasAlreadyUsed<AliasesFromWith, Alias, AliasedTable<Alias, TableRef, Columns, NotUsingWithPart>>
    ): DbSelect00With<AliasesFromWith | Alias, CTX> {
        this.builder.with(table as AnyAliasedTableDef);
        return this as any;
    }

    public select(): DbSelect01From<"", AliasesFromWith, {}, CTX> {
        return new DbSelect01From(this.builder)
    }

}
