import {AliasedTable, AnyAliasedTableDef, CheckIfAliasedTablesAreReferenced, CheckIfAliasIsAlreadyUsed, NOT_REFERENCED, SQL_BOOL, TrueRecord, Value} from "../Types";
import {DbSelect03Columns} from "./DbSelect03Columns";

export class DbSelectJoin<UsedAliases, WithAliases, Tables, UsedTables, CTX> extends DbSelect03Columns<{}, UsedAliases, WithAliases, Tables, UsedTables, CTX> {

    public join<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        RefAlias extends NOT_REFERENCED | string & keyof WithAliases,
        ColTableRef extends string,
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases & WithAliases, Alias, AliasedTable<Alias, TableRef, any, RefAlias>>,
        condition: TableRef extends ColTableRef ? CheckIfAliasedTablesAreReferenced<Tables & TrueRecord<TableRef>, TrueRecord<ColTableRef>, Value<ColTableRef, unknown, SQL_BOOL>> : "Join condition should use columns from the joined table!"
    ): DbSelectJoin<UsedAliases & TrueRecord<Alias>, WithAliases, Tables & TrueRecord<TableRef>, UsedTables, CTX> {
        this.builder.join("JOIN", table as AnyAliasedTableDef, condition as any)
        return this as any;
    }

    public leftJoin<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        RefAlias extends NOT_REFERENCED | string & keyof WithAliases,
        ColTableRef extends string,
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases & WithAliases, Alias, AliasedTable<Alias, TableRef, any, RefAlias>>,
        condition: TableRef extends ColTableRef ? CheckIfAliasedTablesAreReferenced<Tables & TrueRecord<TableRef>, TrueRecord<ColTableRef>, Value<ColTableRef, unknown, SQL_BOOL>> : "Join condition should use columns from the joined table!"
    ): DbSelectJoin<UsedAliases & TrueRecord<Alias>, WithAliases, Tables & TrueRecord<TableRef>, UsedTables, CTX> {
        this.builder.join("LEFT JOIN", table as AnyAliasedTableDef, condition as any)
        return this as any;
    }
}

