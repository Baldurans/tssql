import {AliasedTable, Key, NotUsingWithPart} from "../../Types";
import {S5OrderBy} from "./S5OrderBy";
import {S4Having} from "./S4Having";
import {Expr, SqlExpression} from "../../SqlExpression";

export class S3GroupBy<Result, Tables> extends S5OrderBy<Result, Tables> {

    public groupBy<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, any>[]
    >(
        ...items: isColumnOkToUse<Tables, Columns>
    ): S4Having<Result, Tables> {
        this.builder.groupBy(items as any);
        return new S4Having(this.builder);
    }

    public groupByF<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, any>[]
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): S4Having<Result, Tables> {
        const proxy: any = new Proxy({}, {
            get(target: {}, p: string, receiver: any): any {
                return new SqlExpression(p, p)
            }
        })
        this.builder.groupBy(func(proxy) as any);
        return new S4Having(this.builder);
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

