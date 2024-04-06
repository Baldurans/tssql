import {COMPARISON_SIGNS, RuntimeExpr, SQL_BOOL, Expr, PrepareQueryArgument} from "./Types";
import {Sql} from "./Sql";

export class SqlExpression<TableRef, Name, Type extends string | number | unknown, StrNames> implements RuntimeExpr<TableRef, Name, Type> {

    public readonly expression: string;
    public readonly nameAs: Name | undefined;

    constructor(expression: string, nameAs: Name) {
        this.expression = expression;
        this.nameAs = nameAs;
        Object.freeze(this);
    }

    public static create<TableRef, Name, Type>(expression: string, nameAs?: string | undefined): Expr<TableRef, Name, Type> {
        return new SqlExpression(expression, nameAs) as any
    }

    public cast<CastType extends string | number>(): Expr<TableRef, Name, CastType> {
        return this as any;
    }

    public as<T extends string>(name: T): Expr<TableRef, T, Type> {
        return new SqlExpression<TableRef, T, Type, StrNames>(this.expression, name) as any;
    }

    private asValue(): Expr<TableRef, any, any> {
        return this as any;
    }

    // -------------------------------------------------------------------
    // BOOLEAN CHECKS
    // -------------------------------------------------------------------

    public isNull(): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.isNull(this.asValue());
    }

    public notNull(): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.notNull(this.asValue());
    }

    public in(values: Type[] | PrepareQueryArgument): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.in(this.asValue(), values);
    }

    public is(value: Type): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), "=", value);
    }

    public eq<TableRef2, Type1>(col: Expr<TableRef2, string | unknown, Type1>): Expr<TableRef | TableRef2, unknown, SQL_BOOL> {
        return Sql.compareCol(this.asValue(), "=", col);
    }

    public compare(op: COMPARISON_SIGNS, value: Type): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), op, value)
    }

    public comparec<TableRef2>(op: COMPARISON_SIGNS, col2: Expr<TableRef2, string | unknown, Type>): Expr<TableRef | TableRef2, unknown, SQL_BOOL> {
        return Sql.compareCol(this.asValue(), op, col2)
    }

    public like(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.like(this.asValue(), value);
    }

    public contains(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.contains(this.asValue(), value);
    }

    public startsWith(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.startsWith(this.asValue(), value);
    }

    public endsWith(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.endsWith(this.asValue(), value);
    }

    // -------------------------------------------------------------------
    // MANIPULATION
    // -------------------------------------------------------------------

    public asDate() {
        return Sql.date(this.asValue()).as(this.nameAs as any);
    }

    public asDateTime() {
        return Sql.datetime(this.asValue()).as(this.nameAs as any);
    }

}
