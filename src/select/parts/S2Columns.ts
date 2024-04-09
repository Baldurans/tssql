import {constructWhere, Where} from "./S2Where";
import {Expr} from "../../SqlExpression";
import {SelectBuilder} from "../SelectBuilder";

export function getColumnMethods<Result, Tables>(builder: SelectBuilder): Columns<Result, Tables> {
    return {
        distinct: () => {
            builder.distinct()
            return getColumnMethods(builder)
        },
        columns: (...cols: any[]) => {
            builder.distinct()
            return constructWhere(builder)
        }
    }
}


export interface Columns<Result, Tables> {

    distinct(): this

    columns<
        TableRef,
        Columns extends Expr<TableRef, string, any>[]
    >(
        //...columns: Columns - this will enable seeing sources of Result object properties.
        ...columns: isColumnOkToAdd<Result, Tables, Columns>
    ): Where<Result & ExtractObj<Columns>, Tables>

}

// --------------------------------------------------------------------

/**
 * Take array of Col-s and convert to Record<key, value> & ... object.
 */
type ExtractObj<Columns extends Expr<any, string, any>[]> = {
    [K in Columns[number]['nameAs']]: Extract<Columns[number], { nameAs: K }>['type']
}

// --------------------------------------------------------------------

type _checkIfExistsInOtherFields<Rest extends any[], Expr> =
    Rest extends []
        ? Expr
        : Expr extends { nameAs: string } ?
            Expr["nameAs"] extends (Rest extends { nameAs: infer A }[] ? A : never)
                ? `'${Expr["nameAs"]}' already exists in columns!`
                : Expr
            : Expr extends { nameAs: unknown } ?
                `Is missing column name. Add .as('name')`
                : Expr

type _checkIfExistsInResult<Result, Expr> =
    Expr extends { nameAs: string } ?
        Expr["nameAs"] extends keyof Result
            ? `'${Expr["nameAs"]}' already exists in result columns!`
            : Expr
        : Expr

type _checkThatTableIsReferenced<Tables, Expr> =
    Expr extends { tableRef: string } ?
        Expr["tableRef"] extends keyof Tables
            ? Expr
            : `'${Expr["tableRef"]}' is not used in this query!`
        : Expr

type isColumnOkToAdd<Result, Tables, ColumnExpressions> =
    ColumnExpressions extends []
        ? ColumnExpressions
        : ColumnExpressions extends [...(infer Rest), infer A]
            ? [...isColumnOkToAdd<Result, Tables, Rest>, _checkIfExistsInOtherFields<Rest, _checkIfExistsInResult<Result, _checkThatTableIsReferenced<Tables, A>>>]
            : ColumnExpressions;


// --------------------------------------------------------------------
