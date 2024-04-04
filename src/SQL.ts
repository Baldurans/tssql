import {AnyBoolValue, COMPARISONS, SQL_BOOL, Value, vDate, vDateTime} from "./Types";
import mysql from "mysql";
import {SqlExpression} from "./SqlExpression";

export function clone<TableRef extends string, Name, Type, Type2>(column: Value<TableRef, Name, Type>, overrides: Partial<Value<TableRef, Name, Type2>>): Value<TableRef, Name, Type2> {
    return {...(column as any), ...overrides} as any;
}

export class SQL {

    public static escape(value: string | number): string {
        return mysql.escape(value);
    }

    public static escapeId(value: string): string {
        return mysql.escapeId(value);
    }

    public static expression<TableRef extends string>(...expr: (string | Value<TableRef, string | unknown, string | number | unknown>)[]): Value<TableRef, unknown, unknown> {
        return SqlExpression.create(expr.map(e => typeof e === "string" ? e : e.expression).join(""))
    }

    public static null<Type = null>(): Value<null, unknown, Type> {
        return SqlExpression.create("NULL")
    }

    // -------------------------------------------------------------------
    // BOOLEAN CHECKS
    // -------------------------------------------------------------------

    /**
     * Accepts undefined as well.
     */
    public static or<T1 extends string, T2 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>): Value<T1 | T2, unknown, SQL_BOOL>
    public static or<T1 extends string, T2 extends string, T3 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>): Value<T1 | T2 | T3, unknown, SQL_BOOL>
    public static or<T1 extends string, T2 extends string, T3 extends string, T4 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>, col4: AnyBoolValue<T4>): Value<T1 | T2 | T3 | T4, unknown, SQL_BOOL>
    public static or<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>, col4: AnyBoolValue<T4>, col5: AnyBoolValue<T5>): Value<T1 | T2 | T3 | T4 | T5, unknown, SQL_BOOL>
    public static or<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>, col4: AnyBoolValue<T4>, col5: AnyBoolValue<T5>, col6: AnyBoolValue<T6>): Value<T1 | T2 | T3 | T4 | T5 | T6, unknown, SQL_BOOL>
    public static or(...col: any[]): any {
        return SqlExpression.create<any, unknown, any>("(" + col.filter(e => e).map(e => e.expression).join(" OR ") + ")")
    }

    /**
     * Accepts undefined as well.
     */
    public static and<T1 extends string, T2 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>): Value<T1 | T2, unknown, SQL_BOOL>
    public static and<T1 extends string, T2 extends string, T3 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>): Value<T1 | T2 | T3, unknown, SQL_BOOL>
    public static and<T1 extends string, T2 extends string, T3 extends string, T4 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>, col4: AnyBoolValue<T4>): Value<T1 | T2 | T3 | T4, unknown, SQL_BOOL>
    public static and<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>, col4: AnyBoolValue<T4>, col5: AnyBoolValue<T5>): Value<T1 | T2 | T3 | T4 | T5, unknown, SQL_BOOL>
    public static and<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>, col4: AnyBoolValue<T4>, col5: AnyBoolValue<T5>, col6: AnyBoolValue<T6>): Value<T1 | T2 | T3 | T4 | T5 | T6, unknown, SQL_BOOL>
    public static and(...col: any[]): any {
        return SqlExpression.create<any, unknown, any>("(" + col.filter(e => e).map(e => e.expression).join(" AND ") + ")")
    }

    public static if<
        TableRef1 extends string,
        TableRef2 extends string,
        Type2,
        TableRef3 extends string,
        Type3,
    >(
        col: Value<TableRef1, string | unknown, SQL_BOOL>,
        col2: Value<TableRef2, string | unknown, Type2>,
        col3: Value<TableRef3, string | unknown, Type3>
    ): Value<TableRef1 | TableRef2 | TableRef3, unknown, (Type2 extends Type3 ? Type3 extends Type2 ? Type2 : unknown : unknown)> {
        return SqlExpression.create<any, unknown, any>("IF(" + col.expression + "," + col2.expression + "," + col3.expression + ")")
    }

    public static isNull<TableRef extends string, Name, Type extends string | number>(col: Value<TableRef, Name, Type>): Value<TableRef, Name, SQL_BOOL> {
        return SqlExpression.create<TableRef, Name, SQL_BOOL>(col.expression + " IS NULL")
    }

    public static notNull<TableRef extends string, Name, Type extends string | number>(col: Value<TableRef, Name, Type>): Value<TableRef, Name, SQL_BOOL> {
        return SqlExpression.create<TableRef, Name, SQL_BOOL>(col.expression + " IS NOT NULL")
    }

    /**
     * Column = value (If you want to compare column with another column, use EQC method.
     */
    public static eq<TableRef extends string, Type extends string | number>(col: Value<TableRef, string, Type>, value: Type): Value<TableRef, unknown, SQL_BOOL> {
        return SQL.compare(col, "=", value);
    }

    public static eqc<TableRef1 extends string, TableRef2 extends string, Type1>(col1: Value<TableRef1, string, Type1>, col2: Value<TableRef2, string, Type1>): Value<TableRef1 | TableRef2, unknown, SQL_BOOL> {
        return SQL.comparec(col1, "=", col2);
    }

    /**
     * Column OPERATION value (If you want to compare column with another column, use COMPAREC method.)
     */
    public static compare<TableRef extends string, Type extends string | number>(col: Value<TableRef, string, Type>, op: COMPARISONS, value: Type): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create<TableRef, unknown, SQL_BOOL>(col.expression + " " + op + " " + SQL.escape(value))
    }

    public static comparec<TableRef1 extends string, TableRef2 extends string, Type1>(col1: Value<TableRef1, string, Type1>, op: COMPARISONS, col2: Value<TableRef2, string | unknown, Type1>): Value<TableRef1 | TableRef2, unknown, SQL_BOOL> {
        return SqlExpression.create(col1.expression + " " + op + " " + col2.expression)
    }

    public static like<TableRef extends string>(col: (Value<TableRef, string | unknown, string | unknown>), value: string): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + SQL.escape(value));
    }

    /**
     * Does LIKE %X% search.
     */
    public static contains<TableRef extends string>(col: (Value<TableRef, string | unknown, string | unknown>), value: string): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + SQL.escape("%" + value + "%"));
    }

    /**
     * Does LIKE X% search.
     */
    public static startsWith<TableRef extends string>(col: (Value<TableRef, string | unknown, string | unknown>), value: string): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + SQL.escape(value + "%"));
    }

    /**
     * Does LIKE %X search.
     */
    public static endsWith<TableRef extends string>(col: (Value<TableRef, string | unknown, string | unknown>), value: string): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + SQL.escape("%" + value));
    }

    // -------------------------------------------------------------------
    // MANIPULATION
    // -------------------------------------------------------------------

    public static trim<Type extends string, TableRef extends string>(value: string): Value<TableRef, unknown, Type> {
        return SqlExpression.create("TRIM(" + SQL.escape(value) + ")")
    }

    public static concat<TableRef extends string>(...expr: (string | Value<TableRef, string | unknown, string | number | unknown>)[]): Value<TableRef, unknown, string> {
        return SqlExpression.create("CONCAT(" + expr.map(e => typeof e === "string" ? SQL.escape(e) : e.expression) + ")")
    }

    public static date<TableRef extends string, Name, Type extends vDate | vDateTime>(field: Value<TableRef, Name, Type>): Value<TableRef, Name, vDate> {
        return SqlExpression.create("DATE(" + field.expression + ")")
    }

    public static datetime<TableRef extends string, Name, Type extends vDate | vDateTime>(field: Value<TableRef, Name, Type>): Value<TableRef, Name, vDateTime> {
        return SqlExpression.create("DATETIME(" + field.expression + ")")
    }

    public static dateFormat<Type, TableRef extends string>(col: Value<TableRef, string | unknown, Type>, format: string): Value<TableRef, string, string> {
        return SqlExpression.create("DATE_FORMAT(" + col.expression + ", " + SQL.escape(format) + ")")
    }

    // -------------------------------------------------------------------
    // AGGREGATE FUNCTIONS
    // -------------------------------------------------------------------

    public static min<Type, TableRef extends string>(col: Value<TableRef, string | unknown, Type>): Value<TableRef, unknown, Type> {
        return SqlExpression.create("MIN(" + col.expression + ")")
    }

    public static max<Type, TableRef extends string>(col: Value<TableRef, string | unknown, Type>): Value<TableRef, unknown, Type> {
        return SqlExpression.create("MAX(" + col.expression + ")")
    }

}
