import {Key, OrderByStructure} from "../Types";
import {Expr, SqlExpression} from "../SqlExpression";
import {orderByStructureToSqlString} from "../SqlFunctions";

export class DbWindow<TableRef, Type> {

    private readonly _func: Expr<TableRef, any, Type>;
    private _partitionBy: string[] = []
    private _orderBy: string[] = []
    private _windowName: string = undefined

    constructor(exp: Expr<TableRef, any, Type>) {
        this._func = exp;
    }

    public partitionBy<TableRef2>(...cols: Expr<TableRef2, string, any>[]): DbWindow<TableRef & TableRef2, Type> {
        for (let i = 0; i < cols.length; i++) {
            this._partitionBy.push(cols[i].expression)
        }
        return this as any;
    }

    public orderBy<TableRef2>(...cols: OrderByStructure<Expr<TableRef2, string, any>>): DbWindow<TableRef & TableRef2, Type> {
        this._orderBy.push(...orderByStructureToSqlString(cols))
        return this as any;
    }

    public over<WindowName extends string>(name: WindowName): DbWindow<TableRef & Key<`window:${WindowName}`>, Type> {
        this._windowName = name;
        return this as any;
    }

    public as<Name>(name: Name): Expr<TableRef, Name, Type> {
        return SqlExpression.create(this._func.expression + " OVER (" +
            (this._windowName || "") +
            (this._partitionBy.length > 0 ? " PARTITION BY " + this._partitionBy.map(e => e) : "") +
            (this._orderBy.length > 0 ? " ORDER BY " + this._orderBy.map(e => e) : "") +
            ")", name
        )
            ;
    }
}