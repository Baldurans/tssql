import {Sql} from "./Sql";
import {OrderByStructure, orderByStructureToSqlString} from "./select/DbSelect07OrderBy";
import {Expr, SqlExpression} from "./SqlExpression";

export type ExprWithOver<TableRef, Name, Type extends string | number | unknown> = symbol
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