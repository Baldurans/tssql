import {AnyBoolExpr, COMPARISON_SIGNS, ComparisonOperandsLookup, Expr, isPrepareArgument, PrepareQueryArgument, SQL_BOOL, vDate, vDateTime} from "./Types";
import mysql from "mysql";
import {SqlExpression} from "./SqlExpression";
import {DbUtility} from "./DbUtility";

export class Sql {

    public static escape(value: string | number | PrepareQueryArgument): string {
        if (isPrepareArgument(value)) {
            DbUtility.testIfOkaySqlStringOrThrow(value.name);
            return ":" + value.name
        } else {
            return mysql.escape(value)
        }
    }

    public static escapeId(value: string): string {
        return mysql.escapeId(value);
    }

    public static veryDangerousUnsafeExpression<TableRef extends string>(...expr: (string | Expr<TableRef, string | unknown, string | number | unknown>)[]): Expr<TableRef, unknown, unknown> {
        return SqlExpression.create(expr.map(e => typeof e === "string" ? e : e.expression).join(""))
    }

    public static null<Type = null>(): Expr<null, unknown, Type> {
        return SqlExpression.create("NULL")
    }

    public static string(value: string | PrepareQueryArgument): Expr<null, unknown, string> {
        return SqlExpression.create(this.escape(value))
    }

    public static number(value: number | PrepareQueryArgument): Expr<null, unknown, number> {
        return SqlExpression.create(this.escape(value))
    }

    public static literal<Type extends string | number>(value: Type): Expr<null, unknown, Type> {
        return SqlExpression.create(this.escape(value))
    }

    // -------------------------------------------------------------------
    // BOOLEAN CHECKS
    // -------------------------------------------------------------------

    /**
     * Accepts undefined as well.
     */
    public static or<T1 extends string, T2 extends string>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>
    ): Expr<T1 | T2, unknown, SQL_BOOL>
    public static or<T1 extends string, T2 extends string, T3 extends string>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>
    ): Expr<T1 | T2 | T3, unknown, SQL_BOOL>
    public static or<T1 extends string, T2 extends string, T3 extends string, T4 extends string>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>
    ): Expr<T1 | T2 | T3 | T4, unknown, SQL_BOOL>
    public static or<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>, col5: AnyBoolExpr<T5>
    ): Expr<T1 | T2 | T3 | T4 | T5, unknown, SQL_BOOL>
    public static or<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>, col5: AnyBoolExpr<T5>, col6: AnyBoolExpr<T6>
    ): Expr<T1 | T2 | T3 | T4 | T5 | T6, unknown, SQL_BOOL>
    public static or(...col: any[]): any {
        return SqlExpression.create("(" + col.filter(e => e).map(e => e.expression).join(" OR ") + ")")
    }

    /**
     * Accepts undefined as well.
     */
    public static and<T1 extends string, T2 extends string>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>
    ): Expr<T1 | T2, unknown, SQL_BOOL>
    public static and<T1 extends string, T2 extends string, T3 extends string>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>
    ): Expr<T1 | T2 | T3, unknown, SQL_BOOL>
    public static and<T1 extends string, T2 extends string, T3 extends string, T4 extends string>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>
    ): Expr<T1 | T2 | T3 | T4, unknown, SQL_BOOL>
    public static and<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>, col5: AnyBoolExpr<T5>
    ): Expr<T1 | T2 | T3 | T4 | T5, unknown, SQL_BOOL>
    public static and<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>, col5: AnyBoolExpr<T5>, col6: AnyBoolExpr<T6>
    ): Expr<T1 | T2 | T3 | T4 | T5 | T6, unknown, SQL_BOOL>
    public static and<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T7 extends string>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>, col5: AnyBoolExpr<T5>, col6: AnyBoolExpr<T6>, col7: AnyBoolExpr<T7>
    ): Expr<T1 | T2 | T3 | T4 | T5 | T6 | T7, unknown, SQL_BOOL>
    public static and<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T7 extends string, T8 extends string>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>, col5: AnyBoolExpr<T5>, col6: AnyBoolExpr<T6>, col7: AnyBoolExpr<T7>, col8: AnyBoolExpr<T8>
    ): Expr<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8, unknown, SQL_BOOL>

    public static and(...col: any[]): any {
        return SqlExpression.create("(" + col.filter(e => e).map(e => e.expression).join(" AND ") + ")")
    }

    public static if<
        TableRef1 extends string,
        TableRef2 extends string,
        Type2,
        TableRef3 extends string,
        Type3,
    >(
        col: Expr<TableRef1, string | unknown, SQL_BOOL>,
        col2: Expr<TableRef2, string | unknown, Type2>,
        col3: Expr<TableRef3, string | unknown, Type3>
    ): Expr<TableRef1 | TableRef2 | TableRef3, unknown, (Type2 extends Type3 ? Type3 extends Type2 ? Type2 : unknown : unknown)> {
        return SqlExpression.create("IF(" + col.expression + "," + col2.expression + "," + col3.expression + ")")
    }

    public static isNull<TableRef extends string, Name, Type extends string | number>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, SQL_BOOL> {
        return SqlExpression.create(col.expression + " IS NULL")
    }

    public static notNull<TableRef extends string, Name, Type extends string | number>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, SQL_BOOL> {
        return SqlExpression.create(col.expression + " IS NOT NULL")
    }

    /**
     * Column = value (If you want to compare column with another column, use EQC method.
     */
    public static is<TableRef extends string, Type extends string | number | PrepareQueryArgument>(col: Expr<TableRef, string, Type>, value: Type): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.compare(col, "=", value);
    }

    public static eq<TableRef1 extends string, TableRef2 extends string, Type1>(col1: Expr<TableRef1, string, Type1>, col2: Expr<TableRef2, string, Type1>): Expr<TableRef1 | TableRef2, unknown, SQL_BOOL> {
        return Sql.compareCol(col1, "=", col2);
    }

    /**
     * Column OPERATION value (If you want to compare column with another column, use COMPAREC method.)
     */
    public static compare<TableRef extends string, Type extends string | number | PrepareQueryArgument>(col: Expr<TableRef, string, Type>, op: COMPARISON_SIGNS, value: Type): Expr<TableRef, unknown, SQL_BOOL> {
        if (!ComparisonOperandsLookup.has(op)) {
            throw new Error("Invalid comparison operand '" + op + "'")
        }
        return SqlExpression.create(col.expression + " " + op + " " + this.escape(value))
    }

    public static compareCol<TableRef1 extends string, TableRef2 extends string, Type1>(col1: Expr<TableRef1, string, Type1>, op: COMPARISON_SIGNS, col2: Expr<TableRef2, string | unknown, Type1>): Expr<TableRef1 | TableRef2, unknown, SQL_BOOL> {
        if (!ComparisonOperandsLookup.has(op)) {
            throw new Error("Invalid comparison operand '" + op + "'")
        }
        return SqlExpression.create(col1.expression + " " + op + " " + col2.expression)
    }

    public static like<TableRef extends string, Type extends string | number>(col: (Expr<TableRef, string | unknown, Type>), value: string | PrepareQueryArgument): Expr<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape(value));
    }

    /**
     * Does LIKE %X% search.
     */
    public static contains<TableRef extends string, Type extends string | number>(col: (Expr<TableRef, string | unknown, Type>), value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape("%" + value + "%"));
    }

    /**
     * Does LIKE X% search.
     */
    public static startsWith<TableRef extends string, Type extends string | number>(col: (Expr<TableRef, string | unknown, Type>), value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape(value + "%"));
    }

    /**
     * Does LIKE %X search.
     */
    public static endsWith<TableRef extends string, Type extends string | number>(col: (Expr<TableRef, string | unknown, Type>), value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape("%" + value));
    }

    // -------------------------------------------------------------------
    // MANIPULATION
    // -------------------------------------------------------------------

    public static trim<Type extends string, TableRef extends string>(value: string | PrepareQueryArgument): Expr<TableRef, unknown, Type> {
        return SqlExpression.create("TRIM(" + this.escape(value) + ")")
    }

    public static concat<TableRef extends string>(...expr: (string | PrepareQueryArgument | Expr<TableRef, string | unknown, string | number | unknown>)[]): Expr<TableRef, unknown, string> {
        return SqlExpression.create("CONCAT(" + expr.map(e => typeof e === "string" || isPrepareArgument(e) ? this.escape(e) : e.expression) + ")")
    }

    public static date<TableRef extends string, Name, Type extends vDate | vDateTime>(field: Expr<TableRef, Name, Type>): Expr<TableRef, Name, vDate> {
        return SqlExpression.create("DATE(" + field.expression + ")")
    }

    public static datetime<TableRef extends string, Name, Type extends vDate | vDateTime>(field: Expr<TableRef, Name, Type>): Expr<TableRef, Name, vDateTime> {
        return SqlExpression.create("DATETIME(" + field.expression + ")")
    }

    public static dateFormat<Type, TableRef extends string>(col: Expr<TableRef, string | unknown, Type>, format: string): Expr<TableRef, string, string> {
        return SqlExpression.create("DATE_FORMAT(" + col.expression + ", " + this.escape(format) + ")")
    }

    // -------------------------------------------------------------------
    // AGGREGATE FUNCTIONS
    // -------------------------------------------------------------------

    public static min<Type, TableRef extends string>(col: Expr<TableRef, string | unknown, Type>): Expr<TableRef, unknown, Type> {
        return SqlExpression.create("MIN(" + col.expression + ")")
    }

    public static max<Type, TableRef extends string>(col: Expr<TableRef, string | unknown, Type>): Expr<TableRef, unknown, Type> {
        return SqlExpression.create("MAX(" + col.expression + ")")
    }

}
