import {AliasedTable, AnyAliasedTableDef, Expr, isAliasAlreadyUsed, isTableReferenced, Key, NOT_REFERENCED, SQL_BOOL} from "../Types";
import {DbSelect03Columns} from "./DbSelect03Columns";

export class DbSelectJoin<Aliases, AliasesFromWith, Tables, CTX> extends DbSelect03Columns<{}, Tables, CTX> {

    public join<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`,
        RefAlias extends NOT_REFERENCED | string,
        ColTableRef extends string
    >(
        table: isRefAliasInAliasesFromWith<AliasesFromWith, RefAlias, isAliasAlreadyUsed<Aliases & AliasesFromWith, Alias, AliasedTable<Alias, TableRef, any, RefAlias>>>,
        condition: isConditionUsingJoinedTable<TableRef, ColTableRef, isTableReferenced<Tables & Key<TableRef>, Key<ColTableRef>, Expr<ColTableRef, unknown, SQL_BOOL>>>
    ): DbSelectJoin<Aliases & Key<Alias>, AliasesFromWith, Tables & Key<TableRef>, CTX> {
        this.builder.join("JOIN", table as AnyAliasedTableDef, condition as any)
        return this as any;
    }

    public leftJoin<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`,
        RefAlias extends NOT_REFERENCED | string,
        ColTableRef extends string
    >(
        table: isRefAliasInAliasesFromWith<AliasesFromWith, RefAlias, isAliasAlreadyUsed<Aliases & AliasesFromWith, Alias, AliasedTable<Alias, TableRef, any, RefAlias>>>,
        condition: isConditionUsingJoinedTable<TableRef, ColTableRef, isTableReferenced<Tables & Key<TableRef>, Key<ColTableRef>, Expr<ColTableRef, unknown, SQL_BOOL>>>
    ): DbSelectJoin<Aliases & Key<Alias>, AliasesFromWith, Tables & Key<TableRef>, CTX> {
        this.builder.join("LEFT JOIN", table as AnyAliasedTableDef, condition as any)
        return this as any;
    }

    public join_noCheck<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`,
        RefAlias extends NOT_REFERENCED | string,
        ColTableRef extends string
    >(
        table: AliasedTable<Alias, TableRef, any, RefAlias>,
        condition: isConditionUsingJoinedTable<TableRef, ColTableRef, isTableReferenced<Tables & Key<TableRef>, Key<ColTableRef>, Expr<ColTableRef, unknown, SQL_BOOL>>>
    ): DbSelectJoin<Aliases & Key<Alias>, AliasesFromWith, Tables & Key<TableRef>, CTX> {
        this.builder.join("JOIN", table as AnyAliasedTableDef, condition as any)
        return this as any;
    }

    public leftJoin_noCheck<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`,
        RefAlias extends NOT_REFERENCED | string,
        ColTableRef extends string
    >(
        table: AliasedTable<Alias, TableRef, any, RefAlias>,
        condition: isConditionUsingJoinedTable<TableRef, ColTableRef, isTableReferenced<Tables & Key<TableRef>, Key<ColTableRef>, Expr<ColTableRef, unknown, SQL_BOOL>>>
    ): DbSelectJoin<Aliases & Key<Alias>, AliasesFromWith, Tables & Key<TableRef>, CTX> {
        this.builder.join("LEFT JOIN", table as AnyAliasedTableDef, condition as any)
        return this as any;
    }
}

type isConditionUsingJoinedTable<TableRef, ColTableRef, OUT> = TableRef extends ColTableRef ? OUT : "Join condition should use columns from the joined table!"

type isRefAliasInAliasesFromWith<AliasesFromWith, RefAlias, OUT> = RefAlias extends NOT_REFERENCED | string & keyof AliasesFromWith ? OUT : `Alias '${RefAlias extends string ? RefAlias : RefAlias extends NOT_REFERENCED ? "NOT_REFERENCED" : "???"}' is not defined by any of the with queries!`