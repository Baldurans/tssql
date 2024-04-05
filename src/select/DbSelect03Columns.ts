import {AnyExpr, Expr} from "../Types";
import {DbSelect04Where} from "./DbSelect04Where";
import {DbSelect} from "./DbSelect";

export class DbSelect03Columns<Result, Tables extends string, CTX> extends DbSelect<CTX> {
    public distinct(): this {
        this.builder.distinct();
        return this;
    }

    public columns<Columns extends Expr<Tables, string, any>[]>(
        //...columns: Columns - this will enable seeing sources of Result object properties.
        ...columns: isColumnNameADuplicate<Columns, Result>
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

type _ExtractNameAsUnion<T> = T extends Array<{ nameAs: infer A }> ? A : never;

type _CheckIfExistsInResult<A extends { nameAs: string }, Result> = A["nameAs"] extends keyof Result ? `'${A["nameAs"]}' already exists in columns!` : A

/**
 * Searches for duplicate names in Columns AND Result.
 */
export type isColumnNameADuplicate<Columns, Result> = Columns extends [...(infer B), infer A]
    ? A extends { nameAs: string }
        ? B extends []
            ? [_CheckIfExistsInResult<A, Result>]
            : [...isColumnNameADuplicate<B, Result>, A["nameAs"] extends _ExtractNameAsUnion<B>
                ? `'${A["nameAs"]}' already exists in columns!`
                : _CheckIfExistsInResult<A, Result>
            ]
        : never
    : Columns;

// --------------------------------------------------------------------