import {AliasedTable, DbTableDefinition, NotUsingWithPart, SqlQuery} from "../../Types";
import {Expr} from "../../SqlExpression";
import {UnionMethods} from "./S0Union";

export interface ExecMethods<Result> extends SqlQuery<Result>, UnionMethods<Result> {

    forUpdate(): ExecMethods<Result>

    asScalar<Alias extends string>(
        alias: Alias & ScalarSubQueryAllowsOnlyOneColumn<Alias, Result> extends never ? "Scalar subquery allows only 1 column!" : Alias
    ): Expr<never, Alias, Result[keyof Result]>

    as<Alias extends string>(alias: Alias): AliasedTable<Alias, `(SUBQUERY) as ${Alias}`, Result, NotUsingWithPart>

    toString(lvl?: number): string

    getColumnStruct(): DbTableDefinition<any>

}

/**
 * Basically checks that Result would have only one column defined.
 */
type ScalarSubQueryAllowsOnlyOneColumn<Result, T, Keys extends keyof any = keyof T> =
    Keys extends any
        ? T extends Record<Keys, any>
            ? Exclude<keyof T, Keys> extends never
                ? Result
                : never
            : never
        : never;
