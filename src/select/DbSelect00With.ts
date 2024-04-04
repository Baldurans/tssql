import {AliasedTable, AnyAliasedTableDef, CheckIfAliasIsAlreadyUsed, NOT_REFERENCED, TrueRecord} from "../Types";
import {DbSelect01From} from "./DbSelect01From";
import {DbSelect} from "./DbSelect";

export class DbSelect00With<AliasesFromWith, CTX> extends DbSelect<CTX> {

    public with<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: CheckIfAliasIsAlreadyUsed<AliasesFromWith, Alias, AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>>
    ): DbSelect00With<AliasesFromWith & TrueRecord<Alias>, CTX> {
        this.builder.with(table as AnyAliasedTableDef);
        return this as any;
    }

    public select(): DbSelect01From<{}, AliasesFromWith, {}, CTX> {
        return new DbSelect01From(this.builder)
    }

}
