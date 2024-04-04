import {AliasedTable, AnyAliasedTableDef, isAliasAlreadyUsed, NOT_REFERENCED, Key} from "../Types";
import {DbSelect01From} from "./DbSelect01From";
import {DbSelect} from "./DbSelect";

export class DbSelect00With<AliasesFromWith, CTX> extends DbSelect<CTX> {

    public with<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: isAliasAlreadyUsed<AliasesFromWith, Alias, AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>>
    ): DbSelect00With<AliasesFromWith & Key<Alias>, CTX> {
        this.builder.with(table as AnyAliasedTableDef);
        return this as any;
    }

    public select(): DbSelect01From<{}, AliasesFromWith, {}, CTX> {
        return new DbSelect01From(this.builder)
    }

}
