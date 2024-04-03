import {SQL_BOOL, Value} from "./Types";
import {SQL} from "./SQL";

export class SqlExpression<TableRef extends string, Name extends string | unknown, Type extends string | number | unknown> {

    public readonly expression: string;
    public readonly nameAs: string | undefined;

    constructor(expression: string, nameAs: string) {
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

    public ISNULL<TableRef extends string>(): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(this.expression + " IS NULL");
    }

    public ISNOTNULL<TableRef extends string, Type extends string | number>(value: Type): Value<TableRef, unknown, Type> {
        return SqlExpression.create(this.expression + " IS NOT NULL");
    }

    public EQ<TableRef extends string, Type extends string | number>(value: Type): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(this.expression + " = " + SQL.escape(value));
    }

    public EQC<TableRef1 extends string, TableRef2 extends string, Type1>(col: Value<TableRef2, string, Type1>): Value<TableRef1 | TableRef2, unknown, SQL_BOOL> {
        return SqlExpression.create(this.expression + " = " + col.expression);
    }

    public LIKE<TableRef extends string>(value: string): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(this.expression + " LIKE " + SQL.escape(value));
    }

    public toString() {
        return this.expression + (this.nameAs ? " as " + SQL.escapeId(this.nameAs) : "")
    }

}
