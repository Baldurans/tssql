import {AnyBoolExpr, AnyExpr, COMPARISON_SIGNS, ComparisonOperandsLookup, Expr, isPrepareArgument, PrepareQueryArgument, SQL_BOOL, vDate, vDateTime} from "./Types";
import mysql from "mysql";
import {SqlExpression} from "./SqlExpression";
import {OrderByStructure, orderByStructureToSqlString} from "./select/DbSelect07OrderBy";

export class Sql {

    public static escape(value: string | number | PrepareQueryArgument): string {
        if (isPrepareArgument(value)) {
            if (!/^[A-Za-z]+$/.test(value.name)) {
                throw new Error("Invalid prepare query argument named '" + value.name + "'. Can only contain ascii letters!")
            }
            return ":___arg__" + value.name
        } else {
            return mysql.escape(value)
        }
    }

    public static escapeId(value: string): string {
        return mysql.escapeId(value);
    }

    /**
     * DO NOT USE THIS METHOD :)
     *
     * Using this method is very dangerous, it DOES NOT escape strings passed to the function.
     * If you use a unsafe variable from somewhere to construct a string you are open to SQL injection.
     *
     * If you do happen to use it, make all strings as literals and DO NOT use any variables to construct the string. It will bite you!
     *
     * To safely use columns do this (but in practice this example is dumb, you should do Sql.round(c.price)): ("ROUND(", c.price,")")
     *
     * DO NOT USE THIS METHOD :)
     */
    public static __veryDangerousUnsafeSqlExpression<TableRef extends string>(arg: {
        I_DID_NOT_USE_UNSAFE_VARIABLES_TO_CONSTRUCT_THIS_STRING: (string | Expr<TableRef, string | unknown, string | number | unknown, never>)[]
    }): Expr<TableRef, unknown, unknown, never> {
        return SqlExpression.create("(" + arg.I_DID_NOT_USE_UNSAFE_VARIABLES_TO_CONSTRUCT_THIS_STRING.map(e => typeof e === "string" ? e : e.expression).join("") + ")")
    }

    public static null<Type = null>(): Expr<null, unknown, Type, never> {
        return SqlExpression.create("NULL")
    }

    public static now(): Expr<null, unknown, vDateTime, never> {
        return SqlExpression.create("NOW()")
    }

    public static curDate(): Expr<null, unknown, vDate, never> {
        return SqlExpression.create("CURDATE()")
    }


    public static string(value: string | PrepareQueryArgument): Expr<null, unknown, string, never> {
        return SqlExpression.create(this.escape(value))
    }

    public static number(value: number | PrepareQueryArgument): Expr<null, unknown, number, never> {
        return SqlExpression.create(this.escape(value))
    }

    public static literal<Type extends string | number>(value: Type): Expr<null, unknown, Type, never> {
        return SqlExpression.create(this.escape(value))
    }

    public static field<Name extends string>(value: Name): Expr<null, Name, unknown, Name> {
        return SqlExpression.create(this.escape(value))
    }

    // -------------------------------------------------------------------
    // BOOLEAN CHECKS
    // -------------------------------------------------------------------

    /**
     * Accepts undefined as well.
     */
    public static or<T1 extends string, T2 extends string, S1, S2>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>
    ): Expr<T1 | T2, unknown, SQL_BOOL, S1 | S2>
    public static or<T1 extends string, T2 extends string, T3 extends string, S1, S2, S3>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>
    ): Expr<T1 | T2 | T3, unknown, SQL_BOOL, S1 | S2 | S3>
    public static or<T1 extends string, T2 extends string, T3 extends string, T4 extends string, S1, S2, S3, S4>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>
    ): Expr<T1 | T2 | T3 | T4, unknown, SQL_BOOL, S1 | S2 | S3 | S4>
    public static or<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, S1, S2, S3, S4, S5>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>, col5: AnyBoolExpr<T5>
    ): Expr<T1 | T2 | T3 | T4 | T5, unknown, SQL_BOOL, S1 | S2 | S3 | S4 | S5>
    public static or<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, S1, S2, S3, S4, S6>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>, col5: AnyBoolExpr<T5>, col6: AnyBoolExpr<T6>
    ): Expr<T1 | T2 | T3 | T4 | T5 | T6, unknown, SQL_BOOL, S1 | S2 | S3 | S4 | S6>
    public static or(...col: any[]): any {
        return SqlExpression.create("(" + col.filter(e => e).map(e => e.expression).join(" OR ") + ")")
    }

    /**
     * Accepts undefined as well.
     */
    public static and<T1 extends string, T2 extends string, S1, S2>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>
    ): Expr<T1 | T2, unknown, SQL_BOOL, S1 | S2>
    public static and<T1 extends string, T2 extends string, T3 extends string, S1, S2, S3>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>
    ): Expr<T1 | T2 | T3, unknown, SQL_BOOL, S1 | S2 | S3>
    public static and<T1 extends string, T2 extends string, T3 extends string, T4 extends string, S1, S2, S3, S4>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>
    ): Expr<T1 | T2 | T3 | T4, unknown, SQL_BOOL, S1 | S2 | S3 | S4>
    public static and<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, S1, S2, S3, S4, S5>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>, col5: AnyBoolExpr<T5>
    ): Expr<T1 | T2 | T3 | T4 | T5, unknown, SQL_BOOL, S1 | S2 | S3 | S4 | S5>
    public static and<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, S1, S2, S3, S4, S5, S6>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>, col5: AnyBoolExpr<T5>, col6: AnyBoolExpr<T6>
    ): Expr<T1 | T2 | T3 | T4 | T5 | T6, unknown, SQL_BOOL, S1 | S2 | S3 | S4 | S5 | S6>
    public static and<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T7 extends string, S1, S2, S3, S4, S5, S6, S7>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>, col5: AnyBoolExpr<T5>, col6: AnyBoolExpr<T6>, col7: AnyBoolExpr<T7>
    ): Expr<T1 | T2 | T3 | T4 | T5 | T6 | T7, unknown, SQL_BOOL, S1 | S2 | S3 | S4 | S5 | S6 | S7>
    public static and<T1 extends string, T2 extends string, T3 extends string, T4 extends string, T5 extends string, T6 extends string, T7 extends string, T8 extends string, S1, S2, S3, S4, S5, S6, S7, S8>(
        col1: AnyBoolExpr<T1>, col2: AnyBoolExpr<T2>, col3: AnyBoolExpr<T3>, col4: AnyBoolExpr<T4>, col5: AnyBoolExpr<T5>, col6: AnyBoolExpr<T6>, col7: AnyBoolExpr<T7>, col8: AnyBoolExpr<T8>
    ): Expr<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8, unknown, SQL_BOOL, S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8>

    public static and(...col: any[]): any {
        return SqlExpression.create("(" + col.filter(e => e).map(e => e.expression).join(" AND ") + ")")
    }

    public static if<
        TableRef1 extends string,
        TableRef2 extends string,
        Type2,
        TableRef3 extends string,
        Type3,
        StrNames1,
        StrNames2,
        StrNames3
    >(
        col: Expr<TableRef1, string | unknown, SQL_BOOL, StrNames1>,
        col2: Expr<TableRef2, string | unknown, Type2, StrNames2>,
        col3: Expr<TableRef3, string | unknown, Type3, StrNames3>
    ): Expr<TableRef1 | TableRef2 | TableRef3, unknown, Type2 | Type3, StrNames1 | StrNames2 | StrNames3> {
        return SqlExpression.create("IF(" + col.expression + "," + col2.expression + "," + col3.expression + ")")
    }

    public static isNull<TableRef extends string, Name, Type extends string | number, StrNames>(col: Expr<TableRef, Name, Type, StrNames>): Expr<TableRef, Name, SQL_BOOL, StrNames> {
        return SqlExpression.create(col.expression + " IS NULL")
    }

    public static notNull<TableRef extends string, Name, Type extends string | number, StrNames>(col: Expr<TableRef, Name, Type, StrNames>): Expr<TableRef, Name, SQL_BOOL, StrNames> {
        return SqlExpression.create(col.expression + " IS NOT NULL")
    }

    /**
     * Column = value (If you want to compare column with another column, use EQC method.
     */
    public static is<TableRef extends string, Type extends string | number | PrepareQueryArgument, StrNames>(col: Expr<TableRef, string, Type, StrNames>, value: Type): Expr<TableRef, unknown, SQL_BOOL, StrNames> {
        return Sql.compare(col, "=", value);
    }

    public static eq<TableRef1 extends string, TableRef2 extends string, Type1, StrNames1, StrNames2>(col1: Expr<TableRef1, string, Type1, StrNames1>, col2: Expr<TableRef2, string, Type1, StrNames2>): Expr<TableRef1 | TableRef2, unknown, SQL_BOOL, StrNames1 | StrNames2> {
        return Sql.compareCol(col1, "=", col2);
    }

    /**
     * Column OPERATION value (If you want to compare column with another column, use COMPAREC method.)
     */
    public static compare<TableRef extends string, Type extends string | number | PrepareQueryArgument, StrNames1, StrNames2>(col: Expr<TableRef, string, Type, StrNames1>, op: COMPARISON_SIGNS, value: Type): Expr<TableRef, unknown, SQL_BOOL, StrNames1 | StrNames2> {
        if (!ComparisonOperandsLookup.has(op)) {
            throw new Error("Invalid comparison operand '" + op + "'")
        }
        return SqlExpression.create(col.expression + " " + op + " " + this.escape(value))
    }

    public static compareCol<TableRef1 extends string, TableRef2 extends string, Type1, StrNames1, StrNames2>(col1: Expr<TableRef1, string, Type1, StrNames1>, op: COMPARISON_SIGNS, col2: Expr<TableRef2, string | unknown, Type1, StrNames2>): Expr<TableRef1 | TableRef2, unknown, SQL_BOOL, StrNames1 | StrNames2> {
        if (!ComparisonOperandsLookup.has(op)) {
            throw new Error("Invalid comparison operand '" + op + "'")
        }
        return SqlExpression.create(col1.expression + " " + op + " " + col2.expression)
    }

    public static like<TableRef extends string, Type extends string | number, StrNames>(col: (Expr<TableRef, string | unknown, Type, StrNames>), value: string | PrepareQueryArgument): Expr<TableRef, unknown, SQL_BOOL, StrNames> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape(value));
    }

    /**
     * Does LIKE %X% search.
     */
    public static contains<TableRef extends string, Type extends string | number, StrNames>(col: (Expr<TableRef, string | unknown, Type, StrNames>), value: string): Expr<TableRef, unknown, SQL_BOOL, StrNames> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape("%" + value + "%"));
    }

    /**
     * Does LIKE X% search.
     */
    public static startsWith<TableRef extends string, Type extends string | number, StrNames>(col: (Expr<TableRef, string | unknown, Type, StrNames>), value: string): Expr<TableRef, unknown, SQL_BOOL, StrNames> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape(value + "%"));
    }

    /**
     * Does LIKE %X search.
     */
    public static endsWith<TableRef extends string, Type extends string | number, StrNames>(col: (Expr<TableRef, string | unknown, Type, StrNames>), value: string): Expr<TableRef, unknown, SQL_BOOL, StrNames> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape("%" + value));
    }

    // -------------------------------------------------------------------
    // STRING MANIPULATION
    // -------------------------------------------------------------------

    public static trim<Type extends string, TableRef extends string, StrNames>(value: string | PrepareQueryArgument): Expr<TableRef, unknown, Type, StrNames> {
        return SqlExpression.create("TRIM(" + this.escape(value) + ")")
    }

    /**
     * normal SQL length function, but JS does not allow usage of length.
     */
    public static length2<Type extends string, TableRef extends string, StrNames>(value: string | PrepareQueryArgument | Expr<TableRef, string | unknown, Type, StrNames>): Expr<TableRef, unknown, number, StrNames> {
        return SqlExpression.create("LENGTH(" + this.escape(this._toSqlArg(value)) + ")")
    }

    public static concat<TableRef extends string, StrNames>(...expr: (string | PrepareQueryArgument | Expr<TableRef, any, any, StrNames>)[]): Expr<TableRef, unknown, string, StrNames> {
        return SqlExpression.create("CONCAT (" + expr.map(this._toSqlArg) + ")")
    }

    public static concat_ws<TableRef extends string, StrNames>(separator: string, ...expr: (string | PrepareQueryArgument | Expr<TableRef, any, any, StrNames>)[]): Expr<TableRef, unknown, string, StrNames> {
        return SqlExpression.create("CONCAT_WS(" + this.escape(separator) + "," + expr.map(this._toSqlArg) + ")")
    }

    public static groupConcat<TableRef extends string, StrNames>(
        expr: (string | PrepareQueryArgument | Expr<TableRef, any, any, StrNames>)[],
        separator?: string,
        distinct?: "DISTINCT"
    ): Expr<TableRef, unknown, string, StrNames> {
        return SqlExpression.create("GROUP_CONCAT(" +
            (distinct ? "DISTINCT " : "") +
            "" + expr.map(this._toSqlArg) +
            (separator ? " SEPARATOR " + this.escape(separator) : "") +
            ")");
    }

    public static groupConcatOrderBy<TableRef extends string, OrderByTableRef extends string, StrNames1, StrNames2>(
        expr: (string | PrepareQueryArgument | Expr<TableRef, any, any, StrNames1>)[],
        orderBy: OrderByStructure<Expr<OrderByTableRef, any, any, StrNames2>>,
        separator?: string,
        distinct?: "DISTINCT"
    ): Expr<TableRef | OrderByTableRef, unknown, string, StrNames1 | StrNames2> {
        return SqlExpression.create("GROUP_CONCAT(" +
            (distinct ? "DISTINCT " : "") +
            "" + expr.map(this._toSqlArg) +
            (orderBy && orderBy.length > 0 ? " ORDER BY " + orderByStructureToSqlString(orderBy).join(", ") : "") +
            (separator ? " SEPARATOR " + this.escape(separator) : "") +
            ")");
    }

    // -------------------------------------------------------------------
    // DATE MANIPULATION
    // -------------------------------------------------------------------

    public static date<TableRef extends string, Name, Type extends vDate | vDateTime, StrNames>(field: Expr<TableRef, Name, Type, StrNames>): Expr<TableRef, Name, vDate, StrNames> {
        return SqlExpression.create("DATE(" + field.expression + ")")
    }

    public static datetime<TableRef extends string, Name, Type extends vDate | vDateTime, StrNames>(field: Expr<TableRef, Name, Type, StrNames>): Expr<TableRef, Name, vDateTime, StrNames> {
        return SqlExpression.create("DATETIME(" + field.expression + ")")
    }

    public static dateFormat<Type, TableRef extends string, StrNames>(col: Expr<TableRef, string | unknown, Type, StrNames>, format: string): Expr<TableRef, string, string, StrNames> {
        return SqlExpression.create("DATE_FORMAT(" + col.expression + ", " + this.escape(format) + ")")
    }

    public static datediff<Type extends vDate | vDateTime, TableRef1 extends string, TableRef2 extends string, StrNames1, StrNames2>(col1: Expr<TableRef1, string | unknown, Type, StrNames1>, col2: Expr<TableRef2, string | unknown, Type, StrNames2>): Expr<TableRef1 | TableRef2, string, number, StrNames1 | StrNames2> {
        return SqlExpression.create("DATEDIFF(" + col1.expression + ", " + col2.expression + ")")
    }

    // -------------------------------------------------------------------
    // NUMBER MANIPULATION
    // -------------------------------------------------------------------

    public static math<TableRef extends string, Name, StrNames>(expression: string, args: Expr<TableRef, Name, number, StrNames>[]): Expr<TableRef, Name, number, StrNames> {
        const pattern = /^[0-9+\-*/()?. ]*$/
        if (!pattern.test(expression)) {
            throw new Error("Invalid expression. Expression must match this pattern: " + pattern)
        }
        for (let i = 0; i < args.length; i++) {
            expression = expression.replace("?", args[i].expression);
        }
        return SqlExpression.create("(" + expression + ")")
    }

    public static abs<TableRef extends string, Name, Type extends number, StrNames>(field: Expr<TableRef, Name, Type, StrNames>): Expr<TableRef, Name, number, StrNames> {
        return SqlExpression.create("ABS(" + field.expression + ")")
    }

    public static ceil<TableRef extends string, Name, Type extends number, StrNames>(field: Expr<TableRef, Name, Type, StrNames>): Expr<TableRef, Name, number, StrNames> {
        return SqlExpression.create("CEIL(" + field.expression + ")")
    }

    public static floor<TableRef extends string, Name, Type extends number, StrNames>(field: Expr<TableRef, Name, Type, StrNames>): Expr<TableRef, Name, number, StrNames> {
        return SqlExpression.create("FLOOR(" + field.expression + ")")
    }

    public static round<TableRef extends string, Name, Type extends number, StrNames>(field: Expr<TableRef, Name, Type, StrNames>): Expr<TableRef, Name, number, StrNames> {
        return SqlExpression.create("ROUND(" + field.expression + ")")
    }

    public static sign<TableRef extends string, Name, Type extends number, StrNames>(field: Expr<TableRef, Name, Type, StrNames>): Expr<TableRef, Name, -1 | 0 | 1, StrNames> {
        return SqlExpression.create("SIGN(" + field.expression + ")")
    }

    public static sqrt<TableRef extends string, Name, Type extends number, StrNames>(field: Expr<TableRef, Name, Type, StrNames>): Expr<TableRef, Name, number, StrNames> {
        return SqlExpression.create("SQRT(" + field.expression + ")")
    }

    // -------------------------------------------------------------------
    // AGGREGATE FUNCTIONS
    // -------------------------------------------------------------------

    public static min<Type, TableRef extends string, StrNames>(col: Expr<TableRef, string | unknown, Type, StrNames>): Expr<TableRef, unknown, Type, StrNames> {
        return SqlExpression.create("MIN(" + col.expression + ")")
    }

    public static max<Type, TableRef extends string, StrNames>(col: Expr<TableRef, string | unknown, Type, StrNames>): Expr<TableRef, unknown, Type, StrNames> {
        return SqlExpression.create("MAX(" + col.expression + ")")
    }

    public static sum<Type, TableRef extends string, StrNames>(col: Expr<TableRef, string | unknown, Type, StrNames>): Expr<TableRef, unknown, Type, StrNames> {
        return SqlExpression.create("SUM(" + col.expression + ")")
    }

    public static count<Type, TableRef extends string, StrNames>(col: Expr<TableRef, string | unknown, Type, StrNames>): Expr<TableRef, unknown, Type, StrNames> {
        return SqlExpression.create("COUNT(" + col.expression + ")")
    }

    // -------------------------------------------------------------------
    // UTILITY
    // -------------------------------------------------------------------

    private static _toSqlArg = (e: string | PrepareQueryArgument | AnyExpr) => {
        if (typeof e === "string") {
            return this.escape(e);
        } else if (typeof e === "number") {
            return Number(e);
        } else if (isPrepareArgument(e)) {
            return this.escape(e);
        } else if (e !== undefined && e !== null) {
            return e.expression
        } else {
            throw new Error("Invalid argument " + String(e));
        }
    }

}
