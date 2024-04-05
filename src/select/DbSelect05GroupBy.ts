import {Expr} from "../Types";
import {DbSelect07OrderBy} from "./DbSelect07OrderBy";
import {DbSelect06Having} from "./DbSelect06Having";
import {DbSelect09Exec} from "./DbSelect09Exec";

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

    public async execOne(ctx: CTX): Promise<Result | undefined> {
        this.builder.limit(1);
        return new DbSelect09Exec<Result, CTX>(this.builder).execOne(ctx)
    }

}

export type _checkThatTableOrColumnCanBeReferenced<Result, Tables, Expr> =
    Expr extends { tableRef: string, seenResultColumnNames: string | never } ?
        Expr["tableRef"] extends keyof Tables ?
            Expr["seenResultColumnNames"] extends keyof Result
                ? Expr
                : `Column '${Expr["seenResultColumnNames"]}' is not used in this query!` // @TODO Filter out names that exist in the Result
            : `Table '${Expr["tableRef"]}' is not used in this query!`
        : Expr extends string
            ? Expr extends keyof Result ? Expr : `Column '${Expr}' is not used in this query!`
            : Expr

type isColumnOkToUse<Result, Tables, ColumnExpressions> =
    ColumnExpressions extends []
        ? ColumnExpressions
        : ColumnExpressions extends [infer A, ...(infer Rest)]
            ? [_checkThatTableOrColumnCanBeReferenced<Result, Tables, A>, ...isColumnOkToUse<Result, Tables, Rest>]
            : ColumnExpressions;

