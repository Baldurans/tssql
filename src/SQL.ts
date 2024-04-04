import {AliasedTable, AnyBoolValue, COMPARISONS, NOT_REFERENCED, SQL_BOOL, Value, vDate, vDateTime} from "./Types";
import mysql from "mysql";
import {SqlExpression} from "./SqlExpression";
import {DbUtility} from "./DbUtility";

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

    public static EXPRESSION<TableRef extends string>(...expr: (string | Value<TableRef, string | unknown, string | number | unknown>)[]): Value<TableRef, unknown, unknown> {
        return SqlExpression.create(expr.map(e => typeof e === "string" ? e : e.expression).join(""))
    }

    public static DATE<TableRef extends string, Name, Type extends vDate | vDateTime>(field: Value<TableRef, Name, Type>): Value<TableRef, Name, vDate> {
        return SqlExpression.create("DATE(" + field.expression + ")")
    }

    public static DATETIME<TableRef extends string, Name, Type extends vDate | vDateTime>(field: Value<TableRef, Name, Type>): Value<TableRef, Name, vDate> {
        return SqlExpression.create("DATETIME(" + field.expression + ")")
    }

    public static NULL<Type = null>(): Value<null, unknown, Type> {
        return SqlExpression.create("NULL")
    }

    public static ISNULL<TableRef extends string, Name, Type extends string | number>(col: Value<TableRef, Name, Type>): Value<TableRef, Name, SQL_BOOL> {
        return SqlExpression.create<TableRef, Name, SQL_BOOL>(col.expression + " IS NULL")
    }

    public static NOTNULL<TableRef extends string, Name, Type extends string | number>(col: Value<TableRef, Name, Type>): Value<TableRef, Name, SQL_BOOL> {
        return SqlExpression.create<TableRef, Name, SQL_BOOL>(col.expression + " IS NOT NULL")
    }


    public static UNION<
        Alias extends string,
        TableRef1 extends string,
        Entity1,
        TableRef2 extends string,
        Entity2,
    >(
        alias: Alias,
        table1: AliasedTable<TableRef1, any, Entity1, any>,
        table2: Entity1 extends Entity2 ? Entity2 extends Entity1 ? AliasedTable<TableRef2, any, Entity2, any> : "Must have same structure!" : "Must have same structure!"
    ): AliasedTable<Alias, "(UNION)", Entity2, NOT_REFERENCED>
    public static UNION(alias: string, ...tables: any[]): any {
        console.log(tables);
        return DbUtility.defineDbTable("(" + tables.filter(e => e).map(e => e.expression).join(") UNION (") + ")", alias, tables[0]);
    }

    public static IF<
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

    /**
     * Accepts undefined as well.
     */
    public static OR<T1 extends string, T2 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>): Value<T1 | T2, unknown, SQL_BOOL>
    public static OR<T1 extends string, T2 extends string, T3 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>): Value<T1 | T2 | T3, unknown, SQL_BOOL>
    public static OR<T1 extends string, T2 extends string, T3 extends string, T4 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>, col4: AnyBoolValue<T4>): Value<T1 | T2 | T3 | T4, unknown, SQL_BOOL>
    public static OR<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>, col4: AnyBoolValue<T4>, col5: AnyBoolValue<T5>): Value<T1 | T2 | T3 | T4 | T5, unknown, SQL_BOOL>
    public static OR<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>, col4: AnyBoolValue<T4>, col5: AnyBoolValue<T5>, col6: AnyBoolValue<T6>): Value<T1 | T2 | T3 | T4 | T5 | T6, unknown, SQL_BOOL>
    public static OR(...col: any[]): any {
        return SqlExpression.create<any, unknown, any>("(" + col.filter(e => e).map(e => e.expression).join(" OR ") + ")")
    }

    /**
     * Accepts undefined as well.
     */
    public static AND<T1 extends string, T2 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>): Value<T1 | T2, unknown, SQL_BOOL>
    public static AND<T1 extends string, T2 extends string, T3 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>): Value<T1 | T2 | T3, unknown, SQL_BOOL>
    public static AND<T1 extends string, T2 extends string, T3 extends string, T4 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>, col4: AnyBoolValue<T4>): Value<T1 | T2 | T3 | T4, unknown, SQL_BOOL>
    public static AND<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>, col4: AnyBoolValue<T4>, col5: AnyBoolValue<T5>): Value<T1 | T2 | T3 | T4 | T5, unknown, SQL_BOOL>
    public static AND<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string>(col1: AnyBoolValue<T1>, col2: AnyBoolValue<T2>, col3: AnyBoolValue<T3>, col4: AnyBoolValue<T4>, col5: AnyBoolValue<T5>, col6: AnyBoolValue<T6>): Value<T1 | T2 | T3 | T4 | T5 | T6, unknown, SQL_BOOL>
    public static AND(...col: any[]): any {
        return SqlExpression.create<any, unknown, any>("(" + col.filter(e => e).map(e => e.expression).join(" AND ") + ")")
    }

    /**
     * Column = value (If you want to compare column with another column, use EQC method.
     */
    public static EQ<TableRef extends string, Type extends string | number>(col: Value<TableRef, string, Type>, value: Type): Value<TableRef, unknown, SQL_BOOL> {
        return SQL.COMPARE(col, "=", value);
    }

    public static EQC<TableRef1 extends string, TableRef2 extends string, Type1>(col1: Value<TableRef1, string, Type1>, col2: Value<TableRef2, string, Type1>): Value<TableRef1 | TableRef2, unknown, SQL_BOOL> {
        return SQL.COMPAREC(col1, "=", col2);
    }

    /**
     * Column OPERATION value (If you want to compare column with another column, use COMPAREC method.)
     */
    public static COMPARE<TableRef extends string, Type extends string | number>(col: Value<TableRef, string, Type>, op: COMPARISONS, value: Type): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create<TableRef, unknown, SQL_BOOL>(col.expression + " " + op + " " + SQL.escape(value))
    }

    public static COMPAREC<TableRef1 extends string, TableRef2 extends string, Type1>(col1: Value<TableRef1, string, Type1>, op: COMPARISONS, col2: Value<TableRef2, string | unknown, Type1>): Value<TableRef1 | TableRef2, unknown, SQL_BOOL> {
        return SqlExpression.create(col1.expression + " " + op + " " + col2.expression)
    }

    public static TRIM<Type extends string, TableRef extends string>(value: string): Value<TableRef, unknown, Type> {
        return SqlExpression.create("TRIM(" + SQL.escape(value) + ")")
    }

    public static LIKE<TableRef extends string>(col: (Value<TableRef, string | unknown, string | unknown>), value: string): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + SQL.escape(value));
    }

    public static LIKE_WILD<TableRef extends string>(col: (Value<TableRef, string | unknown, string | unknown>), value: string): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + SQL.escape("%" + value + "%"));
    }

    public static LIKE_PRE<TableRef extends string>(col: (Value<TableRef, string | unknown, string | unknown>), value: string): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + SQL.escape("%" + value));
    }

    public static LIKE_SUF<TableRef extends string>(col: (Value<TableRef, string | unknown, string | unknown>), value: string): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + SQL.escape(value + "%"));
    }

    public static CONCAT<TableRef extends string>(...expr: (string | Value<TableRef, string | unknown, string | number | unknown>)[]): Value<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create("CONCAT(" + expr.map(e => typeof e === "string" ? SQL.escape(e) : e.expression) + ")")
    }

    public static MIN<Type, TableRef extends string>(col: Value<TableRef, string | unknown, Type>): Value<TableRef, unknown, Type> {
        return SqlExpression.create("MIN(" + col.expression + ")")
    }

    public static MAX<Type, TableRef extends string>(col: Value<TableRef, string | unknown, Type>): Value<TableRef, unknown, Type> {
        return SqlExpression.create("MAX(" + col.expression + ")")
    }

    public static DATE_FORMAT<Type, TableRef extends string>(col: Value<TableRef, string | unknown, Type>, format: string): Value<TableRef, string, string> {
        return SqlExpression.create("DATE_FORMAT(" + col.expression + ", " + SQL.escape(format) + ")")
    }
}
