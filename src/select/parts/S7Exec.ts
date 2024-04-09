import {AliasedTable, DbTableDefinition, NotUsingWithPart, SqlQuery} from "../../Types";
import {Expr, SqlExpression} from "../../SqlExpression";
import {MysqlTable} from "../../MysqlTable";
import {SelectBuilder} from "../SelectBuilder";
import {SQL_ENTITY} from "../../Symbols";
import {getUnionMethods, UnionMethods} from "./S0Union";

const TAB = "  ";

export function getExecMethods<Result>(builder: SelectBuilder): ExecMethods<Result> {
    return {
        [SQL_ENTITY]: undefined,
        forUpdate: () => {
            builder.forUpdate()
            return getExecMethods(builder)
        },
        asScalar: (alias: any): any => {
            return SqlExpression.create("(\n" + builder.toString(2) + TAB + ")", alias);
        },
        as: (alias: any): any => {
            return MysqlTable.defineDbTable("(\n" + builder.toString(2) + ")" as "(SUBQUERY)", alias, builder.getColumnStruct())
        },
        toString: (lvl: number = 0) => {
            return builder.toString(lvl)
        },
        getColumnStruct: () => {
            return builder.getColumnStruct()
        },
        ...getUnionMethods(builder)
    }
}

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
