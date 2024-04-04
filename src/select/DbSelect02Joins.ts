import {AliasedTable, AnyAliasedTableDef, CheckIfAliasedTablesAreReferenced, CheckIfAliasIsAlreadyUsed, NOT_REFERENCED, SQL_BOOL, TrueRecord, Value} from "../Types";
import {DbSelect03Columns} from "./DbSelect03Columns";

export class DbSelectJoin<Aliases, AliasesFromWith, Tables, CTX> extends DbSelect03Columns<{}, Tables, CTX> {

    public join<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        RefAlias extends NOT_REFERENCED | string & keyof AliasesFromWith,
        ColTableRef extends string,
    >(
        table: CheckIfAliasIsAlreadyUsed<Aliases & AliasesFromWith, Alias, AliasedTable<Alias, TableRef, any, RefAlias>>,
        condition: TableRef extends ColTableRef ? CheckIfAliasedTablesAreReferenced<Tables & TrueRecord<TableRef>, TrueRecord<ColTableRef>, Value<ColTableRef, unknown, SQL_BOOL>> : "Join condition should use columns from the joined table!"
    ): DbSelectJoin<Aliases & TrueRecord<Alias>, AliasesFromWith, Tables & TrueRecord<TableRef>, CTX> {
        this.builder.join("JOIN", table as AnyAliasedTableDef, condition as any)
        return this as any;
    }

    public leftJoin<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        RefAlias extends NOT_REFERENCED | string & keyof AliasesFromWith,
        ColTableRef extends string,
    >(
        table: CheckIfAliasIsAlreadyUsed<Aliases & AliasesFromWith, Alias, AliasedTable<Alias, TableRef, any, RefAlias>>,
        condition: TableRef extends ColTableRef ? CheckIfAliasedTablesAreReferenced<Tables & TrueRecord<TableRef>, TrueRecord<ColTableRef>, Value<ColTableRef, unknown, SQL_BOOL>> : "Join condition should use columns from the joined table!"
    ): DbSelectJoin<Aliases & TrueRecord<Alias>, AliasesFromWith, Tables & TrueRecord<TableRef>, CTX> {
        this.builder.join("LEFT JOIN", table as AnyAliasedTableDef, condition as any)
        return this as any;
    }
}

