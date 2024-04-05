import {AnyExpr, Expr} from "../Types";
import {DbSelect04Where} from "./DbSelect04Where";
import {DbSelect} from "./DbSelect";

export class DbSelect03Columns<Result, Tables, CTX> extends DbSelect<CTX> {
    public distinct(): this {
        this.builder.distinct();
        return this;
    }

    public columns<
        TableRef extends string,
        Columns extends Expr<TableRef, string, any>[]
    >(
        //...columns: Columns - this will enable seeing sources of Result object properties.
        ...columns: isColumnTableReferenced<Tables, isColumnNameADuplicate<Result, Columns>>
    ): DbSelect04Where<Result & ExtractObj<Columns>, Tables, CTX> {
        this.builder.columns(columns as unknown as AnyExpr[]);
        return new DbSelect04Where(this.builder);
    }

}

// --------------------------------------------------------------------

/**
 * Take array of Col-s and convert to Record<key, value> & ... object.
 */
type ExtractObj<Columns extends Expr<any, string, any>[]> = {
    [K in Columns[number]['nameAs']]: Extract<Columns[number], { nameAs: K }>['type']
};

// --------------------------------------------------------------------


type _checkIfExistsInResult<Result, Expr> =
    Expr extends { nameAs: string } ?
        Expr["nameAs"] extends keyof Result
            ? `'${Expr["nameAs"]}' already exists in result columns!`
            : Expr
        : Expr


type _checkIfExistsInOtherFields<Rest extends any[], Expr> =
    Rest extends []
        ? Expr
        : Expr extends { nameAs: string } ?
            Expr["nameAs"] extends (Rest extends { nameAs: infer A }[] ? A : never)
                ? `'${Expr["nameAs"]}' already exists in columns!`
                : Expr
            : Expr

/**
 * Searches for duplicate names in Columns AND Result.
 */
type isColumnNameADuplicate<Result, ColumnExpressions> =
    ColumnExpressions extends []
        ? ColumnExpressions
        : ColumnExpressions extends [...(infer Rest), infer A]
            ? [...isColumnNameADuplicate<Result, Rest>, _checkIfExistsInOtherFields<Rest, _checkIfExistsInResult<Result, A>>]
            : ColumnExpressions;


/*
type isColumnNameADuplicate<Result, Columns> =
    Columns extends [...(infer B), infer A]
        ? A extends { nameAs: string }
            ? B extends []
                ? [_CheckIfExistsInResult<A, Result>]
                : [...isColumnNameADuplicate<Result, B>, A["nameAs"] extends _ExtractNameAsUnion<B>
                    ? `'${A["nameAs"]}' already exists in columns!`
                    : _CheckIfExistsInResult<A, Result>
                ]
            : [...isColumnNameADuplicate<Result, B>, A]
        : Columns;
 */

// --------------------------------------------------------------------

type isColumnTableReferenced<Tables, Columns> = Columns extends [...(infer B), infer A]
    ? A extends { tableRef: string }
        ? B extends []
            ? [A]
            : [...isColumnTableReferenced<Tables, B>, A["tableRef"] extends keyof Tables
                ? A
                : `Table '${A["tableRef"]}' is not used in the query!`
            ]
        : [...isColumnTableReferenced<Tables, B>, A]
    : Columns;