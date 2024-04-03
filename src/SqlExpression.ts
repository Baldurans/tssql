import {RuntimeValue, SQL_BOOL, Value} from "./Types";
import {SQL} from "./SQL";

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

    public ISNULL(): Value<TableRef, unknown, SQL_BOOL> {
        return SQL.ISNULL(this.asValue());
    }

    public NOTNULL(): Value<TableRef, unknown, SQL_BOOL> {
        return SQL.NOTNULL(this.asValue());
    }

    public EQ(value: Type): Value<TableRef, unknown, SQL_BOOL> {
        return SQL.EQ(this.asValue(), value);
    }

    public EQC<TableRef2 extends string, Type1>(col: Value<TableRef2, string, Type1>): Value<TableRef | TableRef2, unknown, SQL_BOOL> {
        return SQL.EQC(this.asValue(), col);
    }

    public LIKE(value: string): Value<TableRef, unknown, SQL_BOOL> {
        return SQL.LIKE(this.asValue(), value);
    }

    public LIKE_WILD(value: string): Value<TableRef, unknown, SQL_BOOL> {
        return SQL.LIKE_WILD(this.asValue(), value);
    }

    public LIKE_PRE(value: string): Value<TableRef, unknown, SQL_BOOL> {
        return SQL.LIKE_PRE(this.asValue(), value);
    }

    public LIKE_SUF(value: string): Value<TableRef, unknown, SQL_BOOL> {
        return SQL.LIKE_SUF(this.asValue(), value);
    }

}
