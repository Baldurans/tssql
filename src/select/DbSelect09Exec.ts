import {AliasedTable, NOT_REFERENCED, Value} from "../Types";
import {SqlExpression} from "../SqlExpression";
import {DbSelect} from "./DbSelect";
import {DbUtility} from "../DbUtility";
import {DbTableDefinition} from "../Db";

const TAB = "  ";

export class DbSelect09Exec<Result, CTX> extends DbSelect<CTX> {

    public asScalar<Alias extends string>(
        alias: Alias & ScalarSubQueryAllowsOnlyOneColumn<Alias, Result> extends never ? "Scalar subquery allows only 1 column!" : Alias
    ): Value<null, Alias, Result[keyof Result]> {
        return SqlExpression.create("(\n" + this.builder.toString(2) + TAB + ")", alias);
    }

    public as<Alias extends string>(alias: Alias): AliasedTable<Alias, `(SUBQUERY) as ${Alias}`, Result, NOT_REFERENCED> {
        return DbUtility.defineDbTable<"(SUBQUERY)", Alias, Result>("(\n" + this.builder.toString(2) + ")" as "(SUBQUERY)", alias, this.builder.getColumnStruct())
    }

    public toString(lvl: number = 0): string {
        return this.builder.toString(lvl)
    }

    public getColumnStruct(): DbTableDefinition<any> {
        return this.builder.getColumnStruct();
    }

    public async exec(ctx: CTX): Promise<Result[]> {
        return await this.builder.exec(ctx);
    }

    public async execOne<ExpectedResult>(ctx: CTX): Promise<Result | undefined> {
        return (await this.exec(ctx))?.[0];
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
