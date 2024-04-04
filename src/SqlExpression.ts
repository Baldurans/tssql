import {COMPARISON_SIGNS, RuntimeValue, SQL_BOOL, Value} from "./Types";
import {Sql} from "./Sql";

export class SqlExpression<TableRef extends string, Name extends string | unknown, Type extends string | number | unknown> implements RuntimeValue<TableRef, Name, Type> {

    public readonly expression: string;
    public readonly nameAs: Name | undefined;

    constructor(expression: string, nameAs: Name) {
        this.expression = expression;
        this.nameAs = nameAs;
        Object.freeze(this);
    }

    public static create<TableRef extends string, Name, Type>(expression: string, nameAs?: string | undefined): Value<TableRef, Name, Type> {
        return new SqlExpression(expression, nameAs) as any
    }

    public cast<CastType extends string | number>(): Value<TableRef, Name, CastType> {
        return this as any;
    }

    public as<T extends string>(name: T): Value<TableRef, T, Type> {
        return new SqlExpression<TableRef, T, Type>(this.expression, name) as any;
    }

    private asValue(): Value<TableRef, any, any> {
        return this as any;
    }

    // -------------------------------------------------------------------
    // BOOLEAN CHECKS
    // -------------------------------------------------------------------

    public isNull(): Value<TableRef, unknown, SQL_BOOL> {
        return Sql.isNull(this.asValue());
    }

    public notNull(): Value<TableRef, unknown, SQL_BOOL> {
        return Sql.notNull(this.asValue());
    }

    public is(value: Type): Value<TableRef, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), "=", value);
    }

    public eq<TableRef2 extends string, Type1>(col: Value<TableRef2, string | unknown, Type1>): Value<TableRef | TableRef2, unknown, SQL_BOOL> {
        return Sql.compareCol(this.asValue(), "=", col);
    }

    public gt(value: Type): Value<TableRef, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), ">", value);
    }

    public gtc<TableRef2 extends string, Type1>(col: Value<TableRef2, string | unknown, Type1>): Value<TableRef | TableRef2, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), ">", col);
    }

    public gte(value: Type): Value<TableRef, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), ">=", value);
    }

    public gtec<TableRef2 extends string, Type1>(col: Value<TableRef2, string | unknown, Type1>): Value<TableRef | TableRef2, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), ">=", col);
    }

    public lt(value: Type): Value<TableRef, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), "<", value);
    }

    public ltc<TableRef2 extends string, Type1>(col: Value<TableRef2, string | unknown, Type1>): Value<TableRef | TableRef2, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), "<", col);
    }

    public lte(value: Type): Value<TableRef, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), "<=", value);
    }

    public ltec<TableRef2 extends string, Type1>(col: Value<TableRef2, string | unknown, Type1>): Value<TableRef | TableRef2, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), "<=", col);
    }

    public compare(op: COMPARISON_SIGNS, value: Type): Value<TableRef, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), op, value)
    }

    public comparec<TableRef2 extends string>(op: COMPARISON_SIGNS, col2: Value<TableRef2, string | unknown, Type>): Value<TableRef | TableRef2, unknown, SQL_BOOL> {
        return Sql.compareCol(this.asValue(), op, col2)
    }

    public like(value: string): Value<TableRef, unknown, SQL_BOOL> {
        return Sql.like(this.asValue(), value);
    }

    public contains(value: string): Value<TableRef, unknown, SQL_BOOL> {
        return Sql.contains(this.asValue(), value);
    }

    public startsWith(value: string): Value<TableRef, unknown, SQL_BOOL> {
        return Sql.startsWith(this.asValue(), value);
    }

    public endsWith(value: string): Value<TableRef, unknown, SQL_BOOL> {
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
