import {AliasedTable, NotUsingWithPart, SelectExecutor, SqlSelectQuery} from "../../Types";
import {Expr} from "../../SqlExpression";
import {UnionMethods} from "./S0Union";

export interface ExecMethods<Result> extends SqlSelectQuery<Result>, UnionMethods<Result> {

    forUpdate(): ExecMethods<Result>

    asScalar<Alias extends string>(
        alias: Alias & ScalarSubQueryAllowsOnlyOneColumn<Alias, Result> extends never ? "Scalar subquery allows only 1 column!" : Alias
    ): Expr<never, Alias, Result[keyof Result]>

    as<Alias extends string>(alias: Alias): AliasedTable<Alias, `(SUBQUERY) as ${Alias}`, Result, NotUsingWithPart>

    toString(lvl?: number): string

    exec<Args extends any[]>(executor: SelectExecutor<Result, Args>, ...args: Args): Promise<Result[]>

    execOne<Args extends any[]>(executor: SelectExecutor<Result, Args>, ...args: Args): Promise<Result>

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
