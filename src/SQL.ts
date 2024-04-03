import {COMPARISONS, RawValue, Value} from "./Types";
import mysql from "mysql";
import {SqlExpression} from "./SqlExpression";
import {vDate, vDateTime} from "./CustomTypes";

export function clone<TableRef extends string, Name, Type, Type2>(column: Value<TableRef, Name, Type>, overrides: Partial<RawValue<TableRef, Name, Type2>>): Value<TableRef, Name, Type2> {
    return {...(column as any), ...overrides} as any;
}

export class SQL {

    public static escape(value: string | number): string {
        return mysql.escape(value);
    }

    public static escapeId(value: string): string {
        return mysql.escapeId(value);
    }

    public static BOOL<TableRef extends string, >(...expr: (string | Value<TableRef, string | unknown, string | number | unknown>)[]): Value<TableRef, unknown, 0 | 1> {
        return SqlExpression.create(expr.map(e => typeof e === "string" ? e : e.expression).join(""))
    }

    public static EXPR<Type, TableRef extends string>(...expr: (string | Value<TableRef, string | unknown, string | number | unknown>)[]): Value<TableRef, unknown, Type> {
        return SqlExpression.create(expr.map(e => typeof e === "string" ? e : e.expression).join(""))
    }

    public static NULL<Type>(): Value<null, unknown, Type> {
        return SqlExpression.create("NULL")
    }

    public static DATE<TableRef extends string, Name, Type extends vDate | vDateTime>(field: Value<TableRef, Name, Type>): Value<TableRef, Name, vDate> {
        return SqlExpression.create("DATE(" + field.expression + ")")
    }

    public static DATETIME<TableRef extends string, Name, Type extends vDate | vDateTime>(field: Value<TableRef, Name, Type>): Value<TableRef, Name, vDate> {
        return SqlExpression.create("DATETIME(" + field.expression + ")")
    }

    public static ISNULL<TableRef extends string, Name, Type extends string | number>(col: Value<TableRef, Name, Type>): Value<TableRef, Name, 0 | 1> {
        return SqlExpression.create<TableRef, Name, 0 | 1>(col.expression + " = NULL")
    }

    /**
     * Column OPERATION value (If you want to compare column with another column, use COMPAREC method.)
     */
    public static COMPARE<TableRef extends string, Type extends string | number>(col: Value<TableRef, string, Type>, op: COMPARISONS, value: Type): Value<TableRef, unknown, 0 | 1> {
        return SqlExpression.create<TableRef, unknown, 0 | 1>(col.expression + " " + op + " " + SQL.escape(value))
    }

    public static IF<
        TableRef1 extends string,
        Type1,
        TableRef2 extends string,
        Type2,
        TableRef3 extends string,
        Type3,
    >(
        col: Value<TableRef1, string | unknown, Type1>,
        col2: Value<TableRef2, string | unknown, Type2>,
        col3: Value<TableRef3, string | unknown, Type3>
    ): Value<TableRef1 & TableRef2 & TableRef3, unknown, (Type2 extends Type3 ? Type3 extends Type2 ? Type2 : unknown : unknown)> {
        return SqlExpression.create<any, unknown, any>("IF(" + col.expression + "," + col2.expression + "," + col3.expression + ")")
    }

    /**
     * Column = value (If you want to compare column with another column, use EQC method.
     */
    public static EQ<TableRef extends string, Type extends string | number>(col: Value<TableRef, string, Type>, value: Type): Value<TableRef, unknown, 0 | 1> {
        return SQL.COMPARE(col, "=", value);
    }

    public static COMPAREC<TableRef1 extends string, TableRef2 extends string, Type1>(col1: Value<TableRef1, string, Type1>, op: COMPARISONS, col2: Value<TableRef2, string, Type1>): Value<TableRef1 | TableRef2, unknown, 0 | 1> {
        return SqlExpression.create(col1.expression + " " + op + " " + col2.expression)
    }

    public static EQC<TableRef1 extends string, TableRef2 extends string, Type1>(col1: Value<TableRef1, string, Type1>, col2: Value<TableRef2, string, Type1>): Value<TableRef1 | TableRef2, unknown, 0 | 1> {
        return SQL.COMPAREC(col1, "=", col2);
    }

    public static TRIM<Type extends string, TableRef extends string>(value: string): Value<TableRef, unknown, Type> {
        return SqlExpression.create("TRIM(" + SQL.escape(value) + ")")
    }

    public static LIKE<TableRef extends string>(col: (Value<TableRef, string | unknown, string | unknown>), value: string): Value<TableRef, unknown, string> {
        return SqlExpression.create(col.expression + " LIKE " + SQL.escape(value));
    }

    public static CONCAT<TableRef extends string>(...expr: (string | Value<TableRef, string | unknown, string | number | unknown>)[]): Value<TableRef, unknown, string> {
        return SqlExpression.create("CONCAT(" + expr.map(e => typeof e === "string" ? e : e.expression) + ")")
    }

    public static MIN<Type, TableRef extends string>(col: Value<TableRef, string | unknown, Type>): Value<TableRef, unknown, Type> {
        return SqlExpression.create("MIN(" + col.expression + ")")
    }

    public static MAX<Type, TableRef extends string>(col: Value<TableRef, string | unknown, Type>): Value<TableRef, unknown, Type> {
        return SqlExpression.create("MAX(" + col.expression + ")")
    }

    public static DATE_FORMAT<Type, TableRef extends string>(col: Value<TableRef, string | unknown, Type>, format: string): Value<TableRef, string, Type> {
        return SqlExpression.create("DATE_FORMAT(" + col.expression + ", " + SQL.escape(format) + ")")
    }
}
