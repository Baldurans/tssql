import {COMPARISON_SIGNS, ComparisonOperandsLookup, isPrepareArgument, PrepareQueryArgument, SQL_BOOL, vDate, vDateTime} from "./Types";
import mysql from "mysql";
import {AnyBoolExpr, AnyExpr, Expr, ExprWithOver, SqlExpression} from "./SqlExpression";
import {OrderByStructure, orderByStructureToSqlString} from "./select/DbSelect07OrderBy";

export class Sql {

    public static escape(value: string | number | (string | number)[] | PrepareQueryArgument): string {
        return mysql.escape(value)
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

    /**
     * Type is the value. (If string "aa" is given, type of the column will be "aa")
     * Useful for enum values etc.
     */
    public static value<Type extends string | number>(value: Type): Expr<never, unknown, Type> {
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
        Type extends string | number,
        TableRef1 extends string = never,
        TableRef2 extends string = never,
        TableRef3 extends string = never
    >(
        col: Expr<TableRef1, string | unknown, SQL_BOOL>,
        col2: Type | Expr<TableRef2, string | unknown, Type> | PrepareQueryArgument,
        col3: Type | Expr<TableRef3, string | unknown, Type> | PrepareQueryArgument
    ): Expr<TableRef1 | TableRef2 | TableRef3, unknown, Type | Type> {
        return SqlExpression.create("IF( " + col.expression + ", " + this._toSqlArg(col2) + ", " + this._toSqlArg(col3) + " )")
    }

    public static isNull<TableRef, Name, Type extends string | number>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, SQL_BOOL> {
        return SqlExpression.create(col.expression + " IS NULL")
    }

    public static notNull<TableRef, Name, Type extends string | number>(col: Expr<TableRef, Name, Type>): Expr<TableRef, Name, SQL_BOOL> {
        return SqlExpression.create(col.expression + " IS NOT NULL")
    }

    // public static in<TableRef, Type extends (string | number)[] | PrepareQueryArgument>(
    //     col: Expr<TableRef, string, Type>,
    //     values: Type
    // ): Expr<TableRef, unknown, SQL_BOOL>
    public static in<Type extends string | number, TableRef1 = never, TableRef2 = never>(
        col1: Type | Expr<TableRef1, string | unknown, Type> | PrepareQueryArgument,
        col2: Type[] | Expr<TableRef2, string | unknown, Type> | PrepareQueryArgument
    ): Expr<TableRef1 | TableRef2, unknown, Type> {
        return SqlExpression.create(this._toSqlArg(col1) + " IN ( " + this._toSqlArg(col2) + ")")
    }

    // public static eq<TableRef, Type extends string | number | PrepareQueryArgument>(
    //     col: Expr<TableRef, string, Type>,
    //     value: Type
    // ): Expr<TableRef, unknown, SQL_BOOL>
    public static eq<Type1 extends string | number, TableRef1 = never, TableRef2 = never>(
        col1: Type1 | Expr<TableRef1, string | unknown, Type1> | PrepareQueryArgument,
        col2: Type1 | Expr<TableRef2, string | unknown, Type1> | PrepareQueryArgument
    ): Expr<TableRef1 | TableRef2, unknown, SQL_BOOL> {
        return Sql.compare(col1, "=", col2);
    }

    public static compare<Type extends string | number, TableRef = never, TableRef2 = never>(
        col1: Type | Expr<TableRef, string | unknown, Type> | PrepareQueryArgument,
        op: COMPARISON_SIGNS,
        col2: Type | Expr<TableRef2, string | unknown, Type> | PrepareQueryArgument
    ): Expr<TableRef | TableRef2, unknown, SQL_BOOL> {
        if (!ComparisonOperandsLookup.has(op)) {
            throw new Error("Invalid comparison operand '" + op + "'")
        }
        return SqlExpression.create(this._toSqlArg(col1) + " " + op + " " + this._toSqlArg(col2))
    }

    public static like<TableRef>(col: (Expr<TableRef, string | unknown, string | number>), value: string | PrepareQueryArgument): Expr<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape(value));
    }

    /**
     * Does LIKE %X% search.
     */
    public static contains<TableRef>(col: (Expr<TableRef, string | unknown, string | number>), value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape("%" + value + "%"));
    }

    /**
     * Does LIKE X% search.
     */
    public static startsWith<TableRef>(col: (Expr<TableRef, string | unknown, string | number>), value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape(value + "%"));
    }

    /**
     * Does LIKE %X search.
     */
    public static endsWith<TableRef>(col: (Expr<TableRef, string | unknown, string | number>), value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return SqlExpression.create(col.expression + " LIKE " + this.escape("%" + value));
    }

    // -------------------------------------------------------------------
    // STRING MANIPULATION
    // -------------------------------------------------------------------

    public static trim<Type extends string, TableRef = never>(value: string | Expr<TableRef, string | unknown, Type> | PrepareQueryArgument): Expr<TableRef, unknown, Type> {
        return SqlExpression.create("TRIM(" + this._toSqlArg(value) + ")")
    }

    /**
     * normal SQL length function, but JS does not allow usage of length.
     */
    public static length2<TableRef = never>(value: string | Expr<TableRef, string | unknown, string> | PrepareQueryArgument): Expr<TableRef, unknown, number> {
        return SqlExpression.create("LENGTH(" + this._toSqlArg(value) + ")")
    }

    public static concat<TableRef = never>(...expr: (string | PrepareQueryArgument | Expr<TableRef, any, any>)[]): Expr<TableRef, unknown, string> {
        return SqlExpression.create("CONCAT (" + expr.map(this._toSqlArg) + ")")
    }

    public static concat_ws<TableRef = never>(separator: string, ...expr: (string | PrepareQueryArgument | Expr<TableRef, any, any>)[]): Expr<TableRef, unknown, string> {
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

    public static now(): Expr<never, unknown, vDateTime> {
        return SqlExpression.create("NOW()")
    }

    public static curDate(): Expr<never, unknown, vDate> {
        return SqlExpression.create("CURDATE()")
    }

    public static year<Name, TableRef>(field: Expr<TableRef, Name, vDate | vDateTime>): Expr<TableRef, Name, number> {
        return SqlExpression.create("YEAR(" + field.expression + ")")
    }

    public static unixTimestamp<Name, TableRef>(field: Expr<TableRef, Name, vDate>): Expr<TableRef, Name, number> {
        return SqlExpression.create("UNIX_TIMESTAMP(" + field.expression + ")")
    }

    public static date<Name, TableRef>(field: Expr<TableRef, Name, vDate | vDateTime>): Expr<TableRef, Name, vDate> {
        return SqlExpression.create("DATE(" + field.expression + ")")
    }

    public static datetime<Name, TableRef>(field: Expr<TableRef, Name, vDateTime>): Expr<TableRef, Name, vDateTime> {
        return SqlExpression.create("DATETIME(" + field.expression + ")")
    }

    public static dateFormat<Name, TableRef = never>(col: vDate | vDateTime | Expr<TableRef, Name, vDate | vDateTime>, format: string): Expr<TableRef, Name, string> {
        return SqlExpression.create("DATE_FORMAT(" + this._toSqlArg(col) + ", " + this.escape(format) + ")")
    }

    public static dateDiff<TableRef1 = never, TableRef2 = never>(
        col1: vDate | vDateTime | Expr<TableRef1, string | unknown, vDate | vDateTime> | PrepareQueryArgument,
        col2: vDate | vDateTime | Expr<TableRef2, string | unknown, vDate | vDateTime> | PrepareQueryArgument
    ): Expr<TableRef1 | TableRef2, unknown, number> {
        return SqlExpression.create("DATEDIFF(" + this._toSqlArg(col1) + ", " + this._toSqlArg(col2) + ")")
    }

    // -------------------------------------------------------------------
    // NUMBER MANIPULATION
    // -------------------------------------------------------------------

    public static math<Name, TableRef>(expression: string, args: Expr<TableRef, Name, number>[]): Expr<TableRef, Name, number> {
        const pattern = /^[0-9+\-*/()?. ]*$/
        if (!pattern.test(expression)) {
            throw new Error("Invalid expression. Expression must match this pattern: " + pattern)
        }
        for (let i = 0; i < args.length; i++) {
            expression = expression.replace("?", args[i].expression);
        }
        return SqlExpression.create("(" + expression + ")")
    }

    public static abs<Name, TableRef>(col: Expr<TableRef, Name, number>): Expr<TableRef, Name, number> {
        return SqlExpression.create("ABS(" + col.expression + ")", col.nameAs)
    }

    public static ceil<Name, TableRef>(col: Expr<TableRef, Name, number>): Expr<TableRef, Name, number> {
        return SqlExpression.create("CEIL(" + col.expression + ")", col.nameAs)
    }

    public static floor<Name, TableRef>(col: Expr<TableRef, Name, number>): Expr<TableRef, Name, number> {
        return SqlExpression.create("FLOOR(" + col.expression + ")", col.nameAs)
    }

    public static round<Name, TableRef>(col: Expr<TableRef, Name, number>): Expr<TableRef, Name, number> {
        return SqlExpression.create("ROUND(" + col.expression + ")", col.nameAs)
    }

    public static sign<Name, TableRef>(col: Expr<TableRef, Name, number>): Expr<TableRef, Name, -1 | 0 | 1> {
        return SqlExpression.create("SIGN(" + col.expression + ")", col.nameAs)
    }

    public static sqrt<Name, TableRef>(col: Expr<TableRef, Name, number>): Expr<TableRef, Name, number> {
        return SqlExpression.create("SQRT(" + col.expression + ")", col.nameAs)
    }

    // -------------------------------------------------------------------
    // AGGREGATE FUNCTIONS
    // -------------------------------------------------------------------

    public static min<Type, Name, TableRef>(col: Expr<TableRef, Name, Type>): ExprWithOver<TableRef, Name, Type> {
        return SqlExpression.createWithOver("MIN(" + col.expression + ")", col.nameAs)
    }

    public static max<Type, Name, TableRef>(col: Expr<TableRef, Name, Type>): ExprWithOver<TableRef, Name, Type> {
        return SqlExpression.createWithOver("MAX(" + col.expression + ")", col.nameAs)
    }

    public static sum<Type, Name, TableRef = never>(col: Type | Expr<TableRef, Name, Type>): ExprWithOver<TableRef, Name, number> {
        return SqlExpression.createWithOver("SUM(" + this._toSqlArg(col) + ")", (col instanceof SqlExpression ? col.nameAs : undefined))
    }

    public static count<Type, Name, TableRef = never>(col: Type | Expr<TableRef, Name, Type>): Expr<TableRef, Name, number> {
        return SqlExpression.createWithOver("COUNT(" + this._toSqlArg(col) + ")", (col instanceof SqlExpression ? col.nameAs : undefined))
    }

    public static rank(): ExprWithOver<never, unknown, number> {
        return SqlExpression.createWithOver("RANK()", undefined)
    }

    public static rowNumber(): ExprWithOver<never, unknown, number> {
        return SqlExpression.createWithOver("ROW_NUMBER()", undefined)
    }

    public static lag<Type, TableRef>(col: Expr<TableRef, string | unknown, Type>, n?: number, def?: number): ExprWithOver<TableRef, unknown, Type> {
        return SqlExpression.createWithOver("LAG(" + col.expression + "," + (n ? Number(n) : 0) + "," + (def ? Number(def) : 0) + ")", undefined)
    }

    public static lead<Type, TableRef>(col: Expr<TableRef, string | unknown, Type>, n?: number, def?: number): ExprWithOver<TableRef, unknown, Type> {
        return SqlExpression.createWithOver("LEAD(" + col.expression + "," + (n ? Number(n) : 0) + "," + (def ? Number(def) : 0) + ")", undefined)
    }

    public static firstValue<Type, TableRef>(col: Expr<TableRef, string | unknown, Type>): ExprWithOver<TableRef, unknown, Type> {
        return SqlExpression.createWithOver("FIRST_VALUE(" + col.expression + ")", undefined)
    }

    public static lastValue<Type, TableRef>(col: Expr<TableRef, string | unknown, Type>): ExprWithOver<TableRef, unknown, Type> {
        return SqlExpression.createWithOver("LAST_VALUE(" + col.expression + ")", undefined)
    }

    public static nthValue<Type, TableRef>(col: Expr<TableRef, string | unknown, Type>, value: number): ExprWithOver<TableRef, unknown, Type> {
        return SqlExpression.createWithOver("NTH_VALUE(" + col.expression + "," + (value ? Number(value) : 0) + ")", undefined)
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

    private static _toSqlArg = (e: unknown | number | string | boolean | PrepareQueryArgument | AnyExpr): string | number => {
        if (typeof e === "string") {
            return this.escape(e);
        } else if (typeof e === "number") {
            return Number(e);
        } else if (e === null || e === undefined) {
            return "NULL";
        } else if (e === true) {
            return "1";
        } else if (e === false) {
            return "0";
        } else if (e instanceof SqlExpression) {
            return e.expression
        } else if (isPrepareArgument(e)) {
            return e.expression;
        } else {
            throw new Error("Invalid argument " + String(e));
        }
    }

}
