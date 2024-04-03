import {AliasedTable, NOT_REFERENCED, ScalarSubQueryAllowsOnlyOneColumn, Value} from "../Types";
import {Db} from "../Db";
import {SqlExpression} from "../SqlExpression";
import {DbSelect} from "./DbSelect";

const TAB = "  ";

export class DbSelect09Exec<Result, UsedTables, LastType> extends DbSelect {

    public asScalar<Alias extends string>(alias: Alias & ScalarSubQueryAllowsOnlyOneColumn<Alias, Result> extends never ? "Scalar subquery allows only 1 column!" : Alias): Value<keyof UsedTables & string, Alias, LastType> {
        return SqlExpression.create("(\n" + this.builder.toString(TAB + TAB) + TAB + ")", alias);
    }

    public as<Alias extends string>(alias: Alias): AliasedTable<Alias, `(SUBQUERY) as ${Alias}`, Result, NOT_REFERENCED> {
        return Db.defineDbTable<"(SUBQUERY)", Alias, Result>("(\n" + this.builder.toString(TAB + TAB) + TAB + ")" as "(SUBQUERY)", alias, this.builder._columnStruct)
    }

    public toString(): string {
        return this.builder.toString()
    }

    public async exec(): Promise<Result[]> {
        return this.builder.exec();
    }

    public async execOne<ExpectedResult>(): Promise<Result> {
        return this.builder.execOne()
    }
}
