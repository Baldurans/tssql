import {OrderByStructure, TAB} from "../Types";
import {escapeId} from "../escape";
import {AnyExpr} from "../SqlExpression";
import {orderByStructureToSqlString} from "../SqlFunctions";

export class DeleteBuilder {

    private _from: string;
    private _where: string[] = [];
    private _orderBy: string[] = [];
    private _limit: string;

    public from(table: string, alias: string): this {
        this._from = table + (alias ? " as " + escapeId(alias) : "");
        return this;
    }

    public where(col: string): void {
        this._where.push(col)
    }

    public orderBy(items: OrderByStructure<string | AnyExpr>): void {
        this._orderBy.push(...orderByStructureToSqlString(items))
    }

    public limit(limit: number | [number, number]): void {
        if (Array.isArray(limit)) {
            this._limit = Number(limit[0]) + "," + Number(limit[1]);
        } else {
            this._limit = String(Number(limit));
        }
    }

    public toString(lvl: number = 0): string {
        const tabs = TAB.repeat(lvl);
        return "DELETE FROM " + this._from + "\n" +
            (this._where.length > 0 ? tabs + "WHERE " + this._where.join(" AND ") + "\n" : "") +
            (this._orderBy.length > 0 ? tabs + "ORDER BY " + this._orderBy.join(", ") + "\n" : "") +
            (this._limit ? tabs + "LIMIT " + this._limit + "\n" : "")
    }
}