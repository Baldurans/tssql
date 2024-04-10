import {escape, escapeId} from "../escape";
import {SQL_ENTITY} from "../Symbols";
import {ExecUpdateMethods, GatewayUpdateOrderByMethods, GatewayUpdateWhereMethods, UpdateLimitMethods, UpdateResult} from "./UpdateInterfaces";
import {AnyExpr, SqlExpression} from "../SqlExpression";
import {ExecuteSqlQuery, OrderByStructure} from "../Types";
import {orderByStructureToSqlString} from "../SqlFunctions";

export class UpdateBuilder<Entity, CTX> implements ExecUpdateMethods<CTX>,
    GatewayUpdateWhereMethods<Entity, CTX>,
    GatewayUpdateOrderByMethods<Entity, CTX>,
    UpdateLimitMethods<CTX> {

    public readonly [SQL_ENTITY]: undefined; // never used

    private _tableName: string;
    private _set: string[] = []
    private readonly _where: string[] = [];
    private readonly _orderBy: string[] = [];
    private _limit: string;

    private readonly _exec: ExecuteSqlQuery<CTX>;

    constructor(exec: ExecuteSqlQuery<CTX>) {
        this._exec = exec;
    }

    public in(tableName: string) {
        this._tableName = tableName;
        return this;
    }

    public set(obj: any) {
        for (const prop in obj) {
            this._set.push(escapeId(prop) + " = " + escape(obj[prop]));
        }
        return this;
    }

    public where(...cols: any | SqlExpression<any, any, any>): this {
        for (let i = 0; i < cols.length; i++) {
            if (cols[i]) {
                this._where.push(cols[i].expression)
            }
        }
        return this
    }

    public orderBy(...items: any | OrderByStructure<AnyExpr>): this {
        this._orderBy.push(...orderByStructureToSqlString(items))
        return this;
    }

    public noLimit(): this {
        return this;
    }

    public limit1(): this {
        return this.limit(1);
    }

    public limit(limit: number | [number, number]): this {
        if (Array.isArray(limit)) {
            this._limit = Number(limit[0]) + "," + Number(limit[1]);
        } else {
            this._limit = String(Number(limit));
        }
        return this;
    }

    public toString() {
        return "INSERT INTO " + this._tableName + " " +
            (this._set.length > 0 ? "SET \n " + this._set.join(",\n") + "\n" : "") +
            (this._where.length > 0 ? " WHERE " + this._where.join(" AND ") + "\n" : "") +
            (this._orderBy.length > 0 ? " ORDER BY " + this._orderBy.join(", ") + "\n" : "") +
            (this._limit ? "LIMIT " + this._limit : "")
    }

    public async exec(ctx: CTX): Promise<UpdateResult> {
        if (!this._exec) {
            throw new Error("Exec is not configured!")
        }
        return this._exec(ctx, this.toString()) as any;
    }
}