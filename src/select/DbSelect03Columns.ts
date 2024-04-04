import {AnyValue, Value} from "../Types";
import {DbSelect04Where} from "./DbSelect04Where";
import {DbSelect} from "./DbSelect";

export class DbSelect03Columns<Result, Tables, CTX> extends DbSelect<CTX> {
    public distinct(): this {
        this.builder.distinct();
        return this;
    }

    public columns<
        TableRef extends string & keyof Tables,
        Columns extends Value<TableRef, string, any>[]
    >(
        //...columns: Columns - this will enable seeing sources of Result object properties.
        ...columns: CheckForDuplicateColumns<Columns, Result>
    ): DbSelect04Where<Result & ExtractObj<Columns>, Tables, CTX> {
        this.builder.columns(columns as unknown as AnyValue[]);
        return new DbSelect04Where(this.builder);
    }

}

// --------------------------------------------------------------------

/**
 * Take array of Col-s and convert to Record<key, value> & ... object.
 */
type ExtractObj<Columns extends Value<any, string, any>[]> = {
    [K in Columns[number]['nameAs']]: Extract<Columns[number], { nameAs: K }>['type']
};

// --------------------------------------------------------------------

type _ExtractNameAsUnion<T> = T extends Array<{ nameAs: infer A }> ? A : never;

type _CheckIfExistsInResult<A extends { nameAs: string }, Result> = A["nameAs"] extends keyof Result ? `'${A["nameAs"]}' already exists in columns!` : A

/**
 * Searches for duplicate names in Columns AND Result.
 */
export type CheckForDuplicateColumns<Columns, Result> = Columns extends [...(infer B), infer A]
    ? A extends { nameAs: string }
        ? B extends []
            ? [_CheckIfExistsInResult<A, Result>]
            : [...CheckForDuplicateColumns<B, Result>, A["nameAs"] extends _ExtractNameAsUnion<B>
                ? `'${A["nameAs"]}' already exists in columns!`
                : _CheckIfExistsInResult<A, Result>
            ]
        : never
    : Columns;

// --------------------------------------------------------------------