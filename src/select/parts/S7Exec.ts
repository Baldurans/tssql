import {AliasedTable, DbTableDefinition, NotUsingWithPart, SqlQuery} from "../../Types";
import {Expr, SqlExpression} from "../../SqlExpression";
import {SelectQueryPart} from "../SelectQueryPart";
import {SQL_ENTITY} from "../../Symbols";
import {MysqlTable} from "../../MysqlTable";
import {CompareObjectsForUnion, S0Union} from "./S0Union";
import {SelectBuilder} from "../SelectBuilder";

const TAB = "  ";

export class S7Exec<Result> extends SelectQueryPart implements SqlQuery<Result> {

    public readonly [SQL_ENTITY]: Result = undefined;

    public union<Result2>(child: CompareObjectsForUnion<Result, Result2, S7Exec<Result2>>): S0Union<Result> {
        return new S0Union<Result>(new SelectBuilder()).union(this as any).union(child);
    }

    public unionAll<Result2>(child: CompareObjectsForUnion<Result, Result2, S7Exec<Result2>>): S0Union<Result> {
        return new S0Union<Result>(new SelectBuilder()).union(this as any).unionAll(child);
    }

    public forUpdate(): this {
        this.builder.forUpdate()
        return this;
    }

    public asScalar<Alias extends string>(
        alias: Alias & ScalarSubQueryAllowsOnlyOneColumn<Alias, Result> extends never ? "Scalar subquery allows only 1 column!" : Alias
    ): Expr<never, Alias, Result[keyof Result]> {
        return SqlExpression.create("(\n" + this.builder.toString(2) + TAB + ")", alias);
    }

    public as<Alias extends string>(alias: Alias): AliasedTable<Alias, `(SUBQUERY) as ${Alias}`, Result, NotUsingWithPart> {
        return MysqlTable.defineDbTable<"(SUBQUERY)", Alias, Result>("(\n" + this.builder.toString(2) + ")" as "(SUBQUERY)", alias, this.builder.getColumnStruct())
    }

    public toString(lvl: number = 0): string {
        return this.builder.toString(lvl)
    }

    public getColumnStruct(): DbTableDefinition<any> {
        return this.builder.getColumnStruct();
    }

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
