import {COMPARISON_SIGNS, PrepareQueryArgument, SQL_BOOL} from "./Types";
import {COMPARE, CONTAINS, ENDS_WITH, IN, IS_NULL, LIKE, NOT_NULL, STARTS_WITH} from "./SqlFunctions";

export type Expr<TableRef, Name, Type extends string | number | unknown> =
    symbol &
    { tableRef: TableRef, type: Type } &
    SqlExpression<TableRef, Name, Type>

export type AnyBoolExpr<TableRef> = Expr<TableRef, string | unknown, SQL_BOOL>;

export type AnyExpr = Expr<string, string | unknown, string | number | unknown>

export class SqlExpression<TableRef, Name extends string | unknown | undefined, Type extends string | number | unknown> {

    public readonly expression: string;
    public readonly nameAs: Name | undefined;

    constructor(expression: string, nameAs?: Name) {
        this.expression = expression;
        this.nameAs = nameAs;
        Object.freeze(this);
    }

    private asValue(): Expr<TableRef, string | unknown, any> {
        return this as any;
    }

    public static create<TableRef, Name, Type>(expression: string, nameAs?: string | unknown | undefined): Expr<TableRef, Name, Type> {
        return new SqlExpression(expression, nameAs) as any
    }

    public cast<CastType extends string | number>(): Expr<TableRef, Name, CastType> {
        return this as any;
    }

    public as<T extends string>(name: T): Expr<TableRef, T, Type> {
        return new SqlExpression<TableRef, T, Type>(this.expression, name) as any;
    }


    // -------------------------------------------------------------------
    // BOOLEAN CHECKS
    // -------------------------------------------------------------------

    public isNull(): Expr<TableRef, unknown, SQL_BOOL> {
        return IS_NULL(this.asValue());
    }

    public notNull(): Expr<TableRef, unknown, SQL_BOOL> {
        return NOT_NULL(this.asValue());
    }

    public in<TableRef2 = never>(values: Type[] | Expr<TableRef2, string | unknown, Type> | PrepareQueryArgument): Expr<TableRef | TableRef2, unknown, SQL_BOOL> {
        return IN(this.asValue(), values);
    }

    public eq<TableRef2 = never>(col2: Type | Expr<TableRef2, string | unknown, Type> | PrepareQueryArgument): Expr<TableRef | TableRef2, unknown, SQL_BOOL> {
        return COMPARE(this.asValue(), "=", col2);
    }

    public compare<TableRef2 = never>(op: COMPARISON_SIGNS, value: Type | Expr<TableRef2, string | unknown, Type> | PrepareQueryArgument): Expr<TableRef | TableRef2, unknown, SQL_BOOL> {
        return COMPARE(this.asValue(), op, value)
    }

    public like(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return LIKE(this.asValue(), value);
    }

    public contains(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return CONTAINS(this.asValue(), value);
    }

    public startsWith(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return STARTS_WITH(this.asValue(), value);
    }

    public endsWith(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return ENDS_WITH(this.asValue(), value);
    }

}
