import {COMPARISON_SIGNS, ComparisonOperandsLookup, isPrepareArgument, PrepareQueryArgument, SQL_BOOL, vDate, vDateTime} from "./Types";
import mysql from "mysql";
import {AnyBoolExpr, AnyExpr, Expr, SqlExpression} from "./SqlExpression";
import {OrderByStructure, orderByStructureToSqlString} from "./select/DbSelect07OrderBy";

export class Sql {

    public static escape(value: string | number | (string | number)[] | PrepareQueryArgument): string {
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
    public static __veryDangerousUnsafeSqlExpression<TableRef>(arg: {
        I_DID_NOT_USE_UNSAFE_VARIABLES_TO_CONSTRUCT_THIS_STRING: (string | Expr<TableRef, string | unknown, string | number | unknown>)[]
    }): Expr<TableRef, unknown, unknown> {
        return SqlExpression.create("(" + arg.I_DID_NOT_USE_UNSAFE_VARIABLES_TO_CONSTRUCT_THIS_STRING.map(e => typeof e === "string" ? e : e.expression).join("") + ")")
    }

    public static null<Type = null>(): Expr<null, unknown, Type> {
        return SqlExpression.create("NULL")
    }

    /**
     * Any string
     */
    public static string(value: string | PrepareQueryArgument): Expr<null, unknown, string> {
        return SqlExpression.create(this.escape(value))
    }

    /**
     * Any number
     */
    public static number(value: number | PrepareQueryArgument): Expr<null, unknown, number> {
        return SqlExpression.create(this.escape(value))
    }

    /**
     * Type is the value. (If string "aa" is given, type of the column will be "aa")
     * Useful for enum values etc.
     */
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
        TableRef1,
        TableRef2,
        Type2,
        TableRef3 extends string,
        Type3
    >(
        col: Expr<TableRef1, string | unknown, SQL_BOOL>,
        col2: Expr<TableRef2, string | unknown, Type2>,
        col3: Expr<TableRef3, string | unknown, Type3>
    ): Expr<TableRef1 | TableRef2 | TableRef3, unknown, Type2 | Type3> {
        return SqlExpression.create("IF(" + col.expression + "," + col2.expression + "," + col3.expression + ")")
    }

    public static isNull<TableRef, Name, Type extends string | number>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, SQL_BOOL> {
        return SqlExpression.create(col.expression + " IS NULL")
    }

    public static notNull<TableRef, Name, Type extends string | number>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, SQL_BOOL> {
        return SqlExpression.create(col.expression + " IS NOT NULL")
    }

    public static in<TableRef, Type extends (string | number)[] | PrepareQueryArgument>(col: Expr<TableRef, string, Type>, values: Type): Expr<TableRef, unknown, SQL_BOOL>
    public static in<TableRef1, TableRef2, Type1>(col1: Expr<TableRef1, string, Type1>, col2: Expr<TableRef2, string, Type1>): Expr<TableRef1 | TableRef2, unknown, SQL_BOOL>
    public static in(col: any, values: any): any {
        return SqlExpression.create(col.expression + " IN( " + (values instanceof SqlExpression ? values.expression : this.escape(values)) + ")")
    }

    public static eq<TableRef, Type extends string | number | PrepareQueryArgument>(col: Expr<TableRef, string, Type>, value: Type): Expr<TableRef, unknown, SQL_BOOL>
    public static eq<TableRef, Type extends string | number | PrepareQueryArgument, TableRef2>(col: Expr<TableRef, string, Type>, col2: Expr<TableRef2, string, Type>): Expr<TableRef | TableRef2, unknown, SQL_BOOL>
    public static eq(col1: any, col2: any): any {
        return Sql.compare(col1, "=", col2);
    }

    public static compare<TableRef, Type extends string | number | PrepareQueryArgument>(col: Expr<TableRef, string, Type>, op: COMPARISON_SIGNS, value: Type): Expr<TableRef, unknown, SQL_BOOL>
    public static compare<TableRef, Type extends string | number | PrepareQueryArgument, TableRef2>(col1: Expr<TableRef, string, Type>, op: COMPARISON_SIGNS, col2: Expr<TableRef2, string | unknown, Type>): Expr<TableRef | TableRef2, unknown, SQL_BOOL>
    public static compare<TableRef, Type>(col: Expr<TableRef, string, Type>, op: COMPARISON_SIGNS, value: any): Expr<TableRef, unknown, SQL_BOOL> {
        if (!ComparisonOperandsLookup.has(op)) {
            throw new Error("Invalid comparison operand '" + op + "'")
        }
        return SqlExpression.create(col.expression + " " + op + " " + (value instanceof SqlExpression ? value.expression : this.escape(value)))
    }

    public static like<TableRef, Type extends string | number>(col: (Expr<TableRef, string | unknown, Type>), value: string | PrepareQueryArgument): Expr<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape(value));
    }

    /**
     * Does LIKE %X% search.
     */
    public static contains<TableRef, Type extends string | number>(col: (Expr<TableRef, string | unknown, Type>), value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape("%" + value + "%"));
    }

    /**
     * Does LIKE X% search.
     */
    public static startsWith<TableRef, Type extends string | number>(col: (Expr<TableRef, string | unknown, Type>), value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape(value + "%"));
    }

    /**
     * Does LIKE %X search.
     */
    public static endsWith<TableRef, Type extends string | number>(col: (Expr<TableRef, string | unknown, Type>), value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape("%" + value));
    }

    // -------------------------------------------------------------------
    // STRING MANIPULATION
    // -------------------------------------------------------------------

    public static trim<Type extends string, TableRef>(value: string | PrepareQueryArgument): Expr<TableRef, unknown, Type> {
        return SqlExpression.create("TRIM(" + this.escape(value) + ")")
    }

    /**
     * normal SQL length function, but JS does not allow usage of length.
     */
    public static length2<Type extends string, TableRef>(value: string | PrepareQueryArgument | Expr<TableRef, string | unknown, Type>): Expr<TableRef, unknown, number> {
        return SqlExpression.create("LENGTH(" + this.escape(this._toSqlArg(value)) + ")")
    }

    public static concat<TableRef>(...expr: (string | PrepareQueryArgument | Expr<TableRef, any, any>)[]): Expr<TableRef, unknown, string> {
        return SqlExpression.create("CONCAT (" + expr.map(this._toSqlArg) + ")")
    }

    public static concat_ws<TableRef>(separator: string, ...expr: (string | PrepareQueryArgument | Expr<TableRef, any, any>)[]): Expr<TableRef, unknown, string> {
        return SqlExpression.create("CONCAT_WS(" + this.escape(separator) + "," + expr.map(this._toSqlArg) + ")")
    }

    public static groupConcat<TableRef>(
        expr: (string | PrepareQueryArgument | Expr<TableRef, any, any>)[],
        separator?: string,
        distinct?: "DISTINCT"
    ): Expr<TableRef, unknown, string> {
        return SqlExpression.create("GROUP_CONCAT(" +
            (distinct ? "DISTINCT " : "") +
            "" + expr.map(this._toSqlArg) +
            (separator ? " SEPARATOR " + this.escape(separator) : "") +
            ")");
    }

    public static groupConcatOrderBy<TableRef, OrderByTableRef>(
        expr: (string | PrepareQueryArgument | Expr<TableRef, any, any>)[],
        orderBy: OrderByStructure<Expr<OrderByTableRef, any, any>>,
        separator?: string,
        distinct?: "DISTINCT"
    ): Expr<TableRef | OrderByTableRef, unknown, string> {
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

    public static now(): Expr<null, unknown, vDateTime> {
        return SqlExpression.create("NOW()")
    }

    public static curDate(): Expr<null, unknown, vDate> {
        return SqlExpression.create("CURDATE()")
    }

    public static year<TableRef, Name, Type extends vDate | vDateTime>(field: Expr<TableRef, Name, Type>): Expr<TableRef, Name, number> {
        return SqlExpression.create("YEAR(" + field.expression + ")")
    }

    public static unixTimestamp<TableRef, Name, Type extends vDate | vDateTime>(field: Expr<TableRef, Name, Type>): Expr<TableRef, Name, number> {
        return SqlExpression.create("UNIX_TIMESTAMP(" + field.expression + ")")
    }

    public static date<TableRef, Name, Type extends vDate | vDateTime>(field: Expr<TableRef, Name, Type>): Expr<TableRef, Name, vDate> {
        return SqlExpression.create("DATE(" + field.expression + ")")
    }

    public static datetime<TableRef, Name, Type extends vDate | vDateTime>(field: Expr<TableRef, Name, Type>): Expr<TableRef, Name, vDateTime> {
        return SqlExpression.create("DATETIME(" + field.expression + ")")
    }

    public static dateFormat<Type, TableRef, Name extends string | unknown>(col: Expr<TableRef, Name, Type>, format: string): Expr<TableRef, Name, string> {
        return SqlExpression.create("DATE_FORMAT(" + col.expression + ", " + this.escape(format) + ")")
    }

    public static datediff<Type extends vDate | vDateTime, TableRef1, TableRef2>(col1: Expr<TableRef1, string | unknown, Type>, col2: Expr<TableRef2, string | unknown, Type>): Expr<TableRef1 | TableRef2, unknown, number> {
        return SqlExpression.create("DATEDIFF(" + col1.expression + ", " + col2.expression + ")")
    }

    // -------------------------------------------------------------------
    // NUMBER MANIPULATION
    // -------------------------------------------------------------------

    public static math<TableRef, Name>(expression: string, args: Expr<TableRef, Name, number>[]): Expr<TableRef, Name, number> {
        const pattern = /^[0-9+\-*/()?. ]*$/
        if (!pattern.test(expression)) {
            throw new Error("Invalid expression. Expression must match this pattern: " + pattern)
        }
        for (let i = 0; i < args.length; i++) {
            expression = expression.replace("?", args[i].expression);
        }
        return SqlExpression.create("(" + expression + ")")
    }

    public static abs<TableRef, Name, Type extends number>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, number> {
        return SqlExpression.create("ABS(" + col.expression + ")", col.nameAs)
    }

    public static ceil<TableRef, Name, Type extends number>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, number> {
        return SqlExpression.create("CEIL(" + col.expression + ")", col.nameAs)
    }

    public static floor<TableRef, Name, Type extends number>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, number> {
        return SqlExpression.create("FLOOR(" + col.expression + ")", col.nameAs)
    }

    public static round<TableRef, Name, Type extends number>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, number> {
        return SqlExpression.create("ROUND(" + col.expression + ")", col.nameAs)
    }

    public static sign<TableRef, Name, Type extends number>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, -1 | 0 | 1> {
        return SqlExpression.create("SIGN(" + col.expression + ")", col.nameAs)
    }

    public static sqrt<TableRef, Name, Type extends number>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, number> {
        return SqlExpression.create("SQRT(" + col.expression + ")", col.nameAs)
    }

    // -------------------------------------------------------------------
    // AGGREGATE FUNCTIONS
    // -------------------------------------------------------------------

    public static min<Type, TableRef, Name>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, Type> {
        return SqlExpression.create("MIN(" + col.expression + ")", col.nameAs)
    }

    public static max<Type, TableRef, Name>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, Type> {
        return SqlExpression.create("MAX(" + col.expression + ")", col.nameAs)
    }

    public static sum<Type, TableRef, Name>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, Type> {
        return SqlExpression.create("SUM(" + col.expression + ")", col.nameAs)
    }

    public static count<Type, TableRef, Name>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, Type> {
        return SqlExpression.create("COUNT(" + col.expression + ")", col.nameAs)
    }

    public static rank(): Expr<never, unknown, number> {
        return SqlExpression.create("RANK()", undefined)
    }

    public static rowNumber(): Expr<never, unknown, number> {
        return SqlExpression.create("ROW_NUMBER()", undefined)
    }

    public static lag<Type, TableRef>(col: Expr<TableRef, unknown, Type>, n?: number, def?: number): Expr<TableRef, unknown, Type> {
        return SqlExpression.create("LAG(" + col.expression + "," + (n ? Number(n) : 0) + "," + (def ? Number(def) : 0) + ")", undefined)
    }

    public static lead<Type, TableRef>(col: Expr<TableRef, unknown, Type>, n?: number, def?: number): Expr<TableRef, unknown, Type> {
        return SqlExpression.create("LEAD(" + col.expression + "," + (n ? Number(n) : 0) + "," + (def ? Number(def) : 0) + ")", undefined)
    }

    public static firstValue<Type, TableRef>(col: Expr<TableRef, unknown, Type>): Expr<TableRef, unknown, Type> {
        return SqlExpression.create("FIRST_VALUE(" + col.expression + ")", undefined)
    }

    public static lastValue<Type, TableRef>(col: Expr<TableRef, unknown, Type>): Expr<TableRef, unknown, Type> {
        return SqlExpression.create("LAST_VALUE(" + col.expression + ")", undefined)
    }

    public static nthValue<Type, TableRef>(col: Expr<TableRef, unknown, Type>, value: number): Expr<TableRef, unknown, Type> {
        return SqlExpression.create("NTH_VALUE(" + col.expression + "," + (value ? Number(value) : 0) + ")", undefined)
    }

    // -------------------------------------------------------------------
    // MISC
    // -------------------------------------------------------------------

    public static binToUuid<TableRef, Name>(col: Expr<TableRef, Name, any>): Expr<TableRef, Name, string> {
        return SqlExpression.create("BIN_TO_UINT(" + col.expression + ")", col.nameAs)
    }

    // -------------------------------------------------------------------
    // UTILITY
    // -------------------------------------------------------------------

    private static _toSqlArg = (e: unknown | string | PrepareQueryArgument | AnyExpr) => {
        if (typeof e === "string") {
            return this.escape(e);
        } else if (typeof e === "number") {
            return Number(e);
        } else if (isPrepareArgument(e)) {
            return this.escape(e);
        } else if (e !== undefined && e !== null) {
            return (e as AnyExpr).expression
        } else {
            throw new Error("Invalid argument " + String(e));
        }
    }

}
