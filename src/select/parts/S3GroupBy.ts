import {AliasedTable, Key, NotUsingWithPart} from "../../Types";
import {S5OrderBy} from "./S5OrderBy";
import {S4Having} from "./S4Having";
import {S7Exec} from "./S7Exec";
import {Expr, SqlExpression} from "../../SqlExpression";

export class S3GroupBy<Result, Tables, CTX> extends S5OrderBy<Result, Tables, CTX> {

    public groupBy<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, any>[]
    >(
        ...items: isColumnOkToUse<Tables, Columns>
    ): S4Having<Result, Tables, CTX> {
        this.builder.groupBy(items as any);
        return new S4Having(this.builder);
    }

    public groupByF<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, any>[]
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): S4Having<Result, Tables, CTX> {
        const proxy: any = new Proxy({}, {
            get(target: {}, p: string, receiver: any): any {
                return new SqlExpression(p, p)
            }
        })
        this.builder.groupBy(func(proxy) as any);
        return new S4Having(this.builder);
    }


    public async execOne(ctx: CTX): Promise<Result | undefined> {
        this.builder.limit(1);
        return new S7Exec<Result, CTX>(this.builder).execOne(ctx)
    }

}

type _getMissing<Tables, Check> = Check extends keyof Tables ? never : Check;

type _checkThatTableOrColumnCanBeReferenced<Tables, Expr> =
    Expr extends { tableRef: string } ?
        Expr["tableRef"] extends keyof Tables ?
            Expr
            : `Table '${_getMissing<Tables, Expr["tableRef"]>}' is not used in this query!`
        : Expr

export type isColumnOkToUse<Tables, ColumnExpressions> =
    ColumnExpressions extends []
        ? ColumnExpressions
        : ColumnExpressions extends [infer A, ...(infer Rest)]
            ? [_checkThatTableOrColumnCanBeReferenced<Tables, A>, ...isColumnOkToUse<Tables, Rest>]
            : ColumnExpressions;

