import {AliasedTable, AnyAliasedTableDef, isAliasAlreadyUsed, isTableReferenced, Key, NotUsingWithPart, SQL_BOOL} from "../Types";
import {DbSelect03Columns} from "./DbSelect03Columns";
import {Expr} from "../SqlExpression";
import {SqlOverClauseBuilder} from "../SqlExpressionWithOver";

export class DbSelectJoin<Aliases, AliasesFromWith, Tables, CTX> extends DbSelect03Columns<{}, Tables, CTX> {

    public join<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`,
        RefAlias extends NotUsingWithPart | string,
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
        RefAlias extends NotUsingWithPart | string,
        ColTableRef extends string
    >(
        table: isRefAliasInAliasesFromWith<AliasesFromWith, RefAlias, isAliasAlreadyUsed<Aliases & AliasesFromWith, Alias, AliasedTable<Alias, TableRef, any, RefAlias>>>,
        condition: isConditionUsingJoinedTable<TableRef, ColTableRef, isTableReferenced<Tables & Key<TableRef>, Key<ColTableRef>, Expr<ColTableRef, unknown, SQL_BOOL>>>
    ): DbSelectJoin<Aliases & Key<Alias>, AliasesFromWith, Tables & Key<TableRef>, CTX> {
        this.builder.join("LEFT JOIN", table as AnyAliasedTableDef, condition as any)
        return this as any;
    }

    public window<
        WindowName extends string,
        UsedTablesRef extends string
    >(
        name: isAliasAlreadyUsed<Aliases & AliasesFromWith, WindowName, WindowName>,
        func: (builder: SqlOverClauseBuilder<never>) => SqlOverClauseBuilder<UsedTablesRef>
    ): DbSelectJoin<Aliases & Key<WindowName>, AliasesFromWith, Tables & Key<`(window) as ${WindowName}`>, CTX> {
        const builder = new SqlOverClauseBuilder()
        func(builder)
        this.builder.window(name, builder.toString())
        return this as any;
    }
}

type isConditionUsingJoinedTable<TableRef, ColTableRef, OUT> = TableRef extends ColTableRef ? OUT : "Join condition should use columns from the joined table!"

type isRefAliasInAliasesFromWith<AliasesFromWith, RefAlias, OUT> = RefAlias extends NotUsingWithPart | string & keyof AliasesFromWith ? OUT : `Alias '${RefAlias extends string ? RefAlias : RefAlias extends NotUsingWithPart ? "NOT_REFERENCED" : "???"}' is not defined by any of the with queries!`