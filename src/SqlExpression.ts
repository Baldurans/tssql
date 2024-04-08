import {COMPARISON_SIGNS, OrderByStructure, PrepareQueryArgument, SQL_BOOL} from "./Types";
import {COMPARE, CONTAINS, ENDS_WITH, IN, IS_NULL, LIKE, NOT_NULL, orderByStructureToSqlString, STARTS_WITH} from "./SqlFunctions";
import {escapeId} from "./escape";

export type Expr<TableRef, Name, Type extends string | number | unknown> =
    symbol &
    { tableRef: TableRef, type: Type } &
    SqlExpression<TableRef, Name, Type>

export type AnyBoolExpr<TableRef> = Expr<TableRef, string | unknown, SQL_BOOL>;

export type AnyExpr = Expr<string, string | unknown, string | number | unknown>

export class SqlExpression<TableRef, Name extends string | unknown | undefined, Type extends string | number | unknown> {

    public readonly expression: string;
    public readonly nameAs: Name | undefined;

    constructor(expression: string, nameAs?: Name) {
        this.expression = expression;
        this.nameAs = nameAs;
        Object.freeze(this);
    }

    private asValue(): Expr<TableRef, string | unknown, any> {
        return this as any;
    }

    public static create<TableRef, Name, Type>(expression: string, nameAs?: string | unknown | undefined): Expr<TableRef, Name, Type> {
        return new SqlExpression(expression, nameAs) as any
    }

    public cast<CastType extends string | number>(): Expr<TableRef, Name, CastType> {
        return this as any;
    }

    public as<T extends string>(name: T): Expr<TableRef, T, Type> {
        return new SqlExpression<TableRef, T, Type>(this.expression, name) as any;
    }


    // -------------------------------------------------------------------
    // BOOLEAN CHECKS
    // -------------------------------------------------------------------

    public isNull(): Expr<TableRef, unknown, SQL_BOOL> {
        return IS_NULL(this.asValue());
    }

    public notNull(): Expr<TableRef, unknown, SQL_BOOL> {
        return NOT_NULL(this.asValue());
    }

    public in<TableRef2 = never>(values: Type[] | Expr<TableRef2, string | unknown, Type> | PrepareQueryArgument): Expr<TableRef | TableRef2, unknown, SQL_BOOL> {
        return IN(this.asValue(), values);
    }

    public eq<TableRef2 = never>(col2: Type | Expr<TableRef2, string | unknown, Type> | PrepareQueryArgument): Expr<TableRef | TableRef2, unknown, SQL_BOOL> {
        return COMPARE(this.asValue(), "=", col2);
    }

    public compare<TableRef2 = never>(op: COMPARISON_SIGNS, value: Type | Expr<TableRef2, string | unknown, Type> | PrepareQueryArgument): Expr<TableRef | TableRef2, unknown, SQL_BOOL> {
        return COMPARE(this.asValue(), op, value)
    }

    public like(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return LIKE(this.asValue(), value);
    }

    public contains(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return CONTAINS(this.asValue(), value);
    }

    public startsWith(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return STARTS_WITH(this.asValue(), value);
    }

    public endsWith(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return ENDS_WITH(this.asValue(), value);
    }

}

export type ExprWithOver<TableRef, Name, Type extends string | number | unknown> =
    symbol
    & Expr<TableRef, Name, Type>
    & SqlExpressionWithOver<TableRef, Name, Type>

export class SqlExpressionWithOver<TableRef, Name, Type extends string | number | unknown> extends SqlExpression<TableRef, Name, Type> {

    public static create<TableRef, Name, Type>(expression: string, nameAs?: string | unknown | undefined): ExprWithOver<TableRef, Name, Type> {
        return new SqlExpressionWithOver(expression, nameAs) as any
    }

    public over<TableRef1 extends string>(func: (builder: SqlOverClauseBuilder<never>) => SqlOverClauseBuilder<TableRef1>): Expr<TableRef | TableRef1, unknown, Type>
    //public over<WindowName extends string>(namedWindow: WindowName): Expr<TableRef | `${WINDOW} as ${WindowName}`, unknown, Type>
    public over<WindowName extends string, TableRef1>(namedWindow: WindowName, func: (builder: SqlOverClauseBuilder<TableRef1>) => void): Expr<TableRef | TableRef1 | `(window) as ${WindowName}`, unknown, Type>
    public over(a: any, b?: any): any {
        let namedWindow: string = undefined;
        let func: (builder: SqlOverClauseBuilder<never>) => void = undefined;
        if (typeof a === "function") {
            func = a
        } else if (typeof a === "string") {
            namedWindow = a;
            if (typeof b === "function") {
                func = b
            }
        }
        const builder = new SqlOverClauseBuilder<{}>();
        func(builder);
        return SqlExpression.create(this.expression + " OVER (" + (namedWindow ? escapeId(namedWindow) + " " : "") + builder.toString() + ")");
    }

}

export class SqlOverClauseBuilder<TableRef> {

    private _partitionBy: string[];
    private _orderBy: string[];

    public orderBy<TableRef2>(...cols: OrderByStructure<Expr<TableRef2, string, any>>): SqlOverClauseBuilder<TableRef | TableRef2> {
        this._orderBy = orderByStructureToSqlString(cols)
        return this as any;
    }

    public partitionBy<TableRef2>(...cols: Expr<TableRef2, string, any>[]): SqlOverClauseBuilder<TableRef | TableRef2> {
        this._partitionBy = cols.map(e => e.expression)
        return this as any;
    }

    public toString() {
        return (this._partitionBy?.length > 0 ? " PARTITION BY " + this._partitionBy.join(", ") : "") +
            (this._orderBy?.length > 0 ? " ORDER BY " + this._orderBy.join(", ") : "")
    }

}