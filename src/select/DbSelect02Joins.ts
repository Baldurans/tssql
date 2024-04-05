import {AliasedTable, AnyAliasedTableDef, Expr, isAliasAlreadyUsed, isTableReferenced, NotUsingWithPart, SQL_BOOL} from "../Types";
import {DbSelect03Columns} from "./DbSelect03Columns";

export class DbSelectJoin<Aliases, AliasesFromWith, Tables extends string, CTX> extends DbSelect03Columns<{}, Tables, CTX> {

    public join<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`,
        RefAlias extends NotUsingWithPart | string,
        ColTableRef extends string
    >(
        table: isRefAliasInAliasesFromWith<AliasesFromWith, RefAlias, isAliasAlreadyUsed<Aliases | AliasesFromWith, Alias, AliasedTable<Alias, TableRef, any, RefAlias>>>,
        condition: isConditionUsingJoinedTable<TableRef, ColTableRef, isTableReferenced<Tables | TableRef, ColTableRef, Expr<ColTableRef, unknown, SQL_BOOL>>>
    ): DbSelectJoin<Aliases | Alias, AliasesFromWith, Tables | TableRef, CTX> {
        this.builder.join("JOIN", table as AnyAliasedTableDef, condition as any)
        return this as any;
    }

    public leftJoin<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`,
        RefAlias extends NotUsingWithPart | string,
        ColTableRef extends string
    >(
        table: isRefAliasInAliasesFromWith<AliasesFromWith, RefAlias, isAliasAlreadyUsed<Aliases | AliasesFromWith, Alias, AliasedTable<Alias, TableRef, any, RefAlias>>>,
        condition: isConditionUsingJoinedTable<TableRef, ColTableRef, isTableReferenced<Tables | TableRef, ColTableRef, Expr<ColTableRef, unknown, SQL_BOOL>>>
    ): DbSelectJoin<Aliases | Alias, AliasesFromWith, Tables | TableRef, CTX> {
        this.builder.join("LEFT JOIN", table as AnyAliasedTableDef, condition as any)
        return this as any;
    }
}

type isConditionUsingJoinedTable<TableRef, ColTableRef, OUT> = TableRef extends ColTableRef ? OUT : "Join condition should use columns from the joined table!"

type isRefAliasInAliasesFromWith<AliasesFromWith, RefAlias, OUT> = RefAlias extends NotUsingWithPart | string & AliasesFromWith ? OUT : `Alias '${RefAlias extends string ? RefAlias : RefAlias extends NotUsingWithPart ? "NOT_REFERENCED" : "???"}' is not defined by any of the with queries!`