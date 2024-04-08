import {AliasedTable, AnyAliasedTableDef, isAliasAlreadyUsed, isTableReferenced, Key, NotUsingWithPart, SQL_BOOL} from "../../Types";
import {S2Columns} from "./S2Columns";
import {Expr, Over} from "../../SqlExpression";

export class S1Join<Aliases, AliasesFromWith, Tables> extends S2Columns<{}, Tables> {

    public join<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`,
        RefAlias extends NotUsingWithPart | string,
        ColTableRef extends string
    >(
        table: isRefAliasInAliasesFromWith<AliasesFromWith, RefAlias, isAliasAlreadyUsed<Aliases & AliasesFromWith, Alias, AliasedTable<Alias, TableRef, any, RefAlias>>>,
        condition: isConditionUsingJoinedTable<TableRef, ColTableRef, isTableReferenced<Tables & Key<TableRef>, Key<ColTableRef>, Expr<ColTableRef, unknown, SQL_BOOL>>>
    ): S1Join<Aliases & Key<Alias>, AliasesFromWith, Tables & Key<TableRef>> {
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
    ): S1Join<Aliases & Key<Alias>, AliasesFromWith, Tables & Key<TableRef>> {
        this.builder.join("LEFT JOIN", table as AnyAliasedTableDef, condition as any)
        return this as any;
    }

    public window<
        WindowName extends string,
        UsedTablesRef extends string
    >(
        name: isAliasAlreadyUsed<Aliases & AliasesFromWith, WindowName, WindowName>,
        func: (builder: Over<never>) => Over<UsedTablesRef>
    ): S1Join<Aliases & Key<WindowName>, AliasesFromWith, Tables & Key<`(window) as ${WindowName}`>> {
        const builder = new Over()
        func(builder)
        this.builder.window(name, builder.toString())
        return this as any;
    }
}

type isConditionUsingJoinedTable<TableRef, ColTableRef, OUT> = TableRef extends ColTableRef ? OUT : "Join condition should use columns from the joined table!"

type isRefAliasInAliasesFromWith<AliasesFromWith, RefAlias, OUT> = RefAlias extends NotUsingWithPart | string & keyof AliasesFromWith ? OUT : `Alias '${RefAlias extends string ? RefAlias : RefAlias extends NotUsingWithPart ? "NOT_REFERENCED" : "???"}' is not defined by any of the with queries!`