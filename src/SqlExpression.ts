import {COMPARISON_SIGNS, PrepareQueryArgument, SQL_BOOL, vDate, vDateTime} from "./Types";
import {Sql} from "./Sql";
import {OrderByStructure, orderByStructureToSqlString} from "./select/DbSelect07OrderBy";

export type Expr<TableRef, Name, Type extends string | number | unknown> = symbol & {
    tableRef: TableRef
    type: Type
} & SqlExpression<TableRef, Name, Type>

export type ExprWithOver<TableRef, Name, Type extends string | number | unknown> = symbol
    & Expr<TableRef, Name, Type>
    & SqlExpressionWithOver<TableRef, Name, Type>

export type AnyBoolExpr<TableRef> = Expr<TableRef, string | unknown, SQL_BOOL>;

export type AnyExpr = Expr<string, string | unknown, string | number | unknown>

export class SqlExpression<TableRef, Name, Type extends string | number | unknown> {

    public readonly expression: string;
    public readonly nameAs: Name | undefined;

    constructor(expression: string, nameAs: Name) {
        this.expression = expression;
        this.nameAs = nameAs;
        Object.freeze(this);
    }

    public static create<TableRef, Name, Type>(expression: string, nameAs?: string | unknown | undefined): Expr<TableRef, Name, Type> {
        return new SqlExpression(expression, nameAs) as any
    }

    public static createWithOver<TableRef, Name, Type>(expression: string, nameAs?: string | unknown | undefined): ExprWithOver<TableRef, Name, Type> {
        return new SqlExpressionWithOver(expression, nameAs) as any
    }

    public cast<CastType extends string | number>(): Expr<TableRef, Name, CastType> {
        return this as any;
    }

    public as<T extends string>(name: T): Expr<TableRef, T, Type> {
        return new SqlExpression<TableRef, T, Type>(this.expression, name) as any;
    }

    private asValue(): Expr<TableRef, string | unknown, any> {
        return this as any;
    }

    // -------------------------------------------------------------------
    // BOOLEAN CHECKS
    // -------------------------------------------------------------------

    public isNull(): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.isNull(this.asValue());
    }

    public notNull(): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.notNull(this.asValue());
    }

    public in<TableRef2 = never>(values: Type[] | Expr<TableRef2, string | unknown, Type> | PrepareQueryArgument): Expr<TableRef | TableRef2, unknown, SQL_BOOL> {
        return Sql.in(this.asValue(), values);
    }

    public eq<TableRef2 = never>(col2: Type | Expr<TableRef2, string | unknown, Type> | PrepareQueryArgument): Expr<TableRef | TableRef2, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), "=", col2);
    }

    public compare<TableRef2 = never>(op: COMPARISON_SIGNS, value: Type | Expr<TableRef2, string | unknown, Type> | PrepareQueryArgument): Expr<TableRef | TableRef2, unknown, SQL_BOOL> {
        return Sql.compare(this.asValue(), op, value)
    }

    public like(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.like(this.asValue(), value);
    }

    public contains(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.contains(this.asValue(), value);
    }

    public startsWith(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.startsWith(this.asValue(), value);
    }

    public endsWith(value: string): Expr<TableRef, unknown, SQL_BOOL> {
        return Sql.endsWith(this.asValue(), value);
    }

    // -------------------------------------------------------------------
    // MANIPULATION
    // -------------------------------------------------------------------

    public asUnixTimestamp(): Expr<TableRef, Name, number> {
        return Sql.unixTimestamp(this.asValue()).as(this.nameAs as any);
    }

    public asDate(): Expr<TableRef, Name, vDate> {
        return Sql.date(this.asValue()).as(this.nameAs as any);
    }

    public asDateTime(): Expr<TableRef, Name, vDateTime> {
        return Sql.datetime(this.asValue()).as(this.nameAs as any);
    }

}


export class SqlExpressionWithOver<TableRef, Name, Type extends string | number | unknown> extends SqlExpression<TableRef, Name, Type> {

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
        return SqlExpression.create(this.expression + " OVER (" + (namedWindow ? Sql.escapeId(namedWindow) + " " : "") + builder.toString() + ")");
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
