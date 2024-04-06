import {AliasedTable, Expr, Key, NotUsingWithPart} from "../Types";
import {DbSelect07OrderBy} from "./DbSelect07OrderBy";
import {DbSelect06Having} from "./DbSelect06Having";
import {DbSelect09Exec} from "./DbSelect09Exec";
import {SqlExpression} from "../SqlExpression";

export class DbSelect05GroupBy<Result, Tables, CTX> extends DbSelect07OrderBy<Result, Tables, CTX> {

    public groupBy<
        TableRef extends string,
        Str extends string,
        Columns extends (Str | Expr<TableRef, string | unknown, any, string | never>)[]
    >(
        ...items: isColumnOkToUse<Result, Tables, Columns>
    ): DbSelect06Having<Result, Tables, CTX> {
        this.builder.groupBy(items as any);
        return new DbSelect06Having(this.builder);
    }

    public groupByF<
        TableRef extends string,
        Columns extends Expr<TableRef, string | unknown, any, string | never>[]
    >(
        func: (columnsTable: AliasedTable<"__res", "__res", Result, NotUsingWithPart>) => isColumnOkToUse<Result, Tables & Key<"__res">, Columns>
    ): DbSelect06Having<Result, Tables, CTX> {
        const proxy: any = new Proxy({}, {
            get(target: {}, p: string, receiver: any): any {
                return new SqlExpression(p, p)
            }
        })
        this.builder.groupBy(func(proxy) as any);
        return new DbSelect06Having(this.builder);
    }


    public async execOne(ctx: CTX): Promise<Result | undefined> {
        this.builder.limit(1);
        return new DbSelect09Exec<Result, CTX>(this.builder).execOne(ctx)
    }

}

type _checkThatTableOrColumnCanBeReferenced<Result, Tables, Expr> =
    Expr extends { tableRef: string, seenResultColumnNames: string | never } ?
        Expr["tableRef"] extends keyof Tables ?
            Expr["seenResultColumnNames"] extends keyof Result
                ? Expr
                : `Column '${Expr["seenResultColumnNames"]}' is not used in this query!` // @TODO Filter out names that exist in the Result
            : `Table '${Expr["tableRef"]}' is not used in this query!`
        : Expr extends string
            ? Expr extends keyof Result ? Expr : `Column '${Expr}' is not used in this query!`
            : Expr

export type isColumnOkToUse<Result, Tables, ColumnExpressions> =
    ColumnExpressions extends []
        ? ColumnExpressions
        : ColumnExpressions extends [infer A, ...(infer Rest)]
            ? [_checkThatTableOrColumnCanBeReferenced<Result, Tables, A>, ...isColumnOkToUse<Result, Tables, Rest>]
            : ColumnExpressions;

