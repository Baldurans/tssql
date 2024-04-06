import {DbTableDefinition} from "../Db";
import {Sql} from "../Sql";
import {SqlExpression} from "../SqlExpression";
import {AnyAliasedTableDef, AnyExpr} from "../Types";
import {DbUtility} from "../DbUtility";
import {OrderByStructure, orderByStructureToSqlString} from "./DbSelect07OrderBy";

const TAB = "  ";


export class DbSelectBuilder<CTX> {

    private readonly _exec: (ctx: CTX, query: string) => Promise<any[]>

    private _withQueries: Map<string, string> = new Map()
    private _from: string;
    private readonly _columns: string[] = [];
    private _columnStruct: DbTableDefinition<any> = {} as any;

    private readonly _joins: string[] = []
    private readonly _where: string[] = []
    private readonly _having: string[] = [];
    private readonly _groupBy: string[] = [];
    private readonly _orderBy: string[] = []
    private _limit: string = ""

    private readonly unions: string[] = [];
    private _unionColumnOrder: string[] = [];

    private _distinct: boolean = false;
    private _forUpdate: boolean = false;

    constructor(exec: (ctx: CTX, query: string) => Promise<any[]>) {
        this._exec = exec;
    }

    public getColumnStruct(): DbTableDefinition<any> {
        return this._columnStruct;
    }

    public union(type: "ALL" | "", sql: string, struct: DbTableDefinition<any>): void {
        if (this.unions.length === 0) {
            this.unions.push("(\n" + sql + ") ")
            this._columnStruct = struct;
            for (const k in struct) {
                this._unionColumnOrder.push(k);
            }
        } else {
            let i = 0;
            for (const k in struct) {
                if (this._unionColumnOrder[i] !== k) {
                    const order: string[] = []
                    for (const k in struct) {
                        order.push(k);
                    }
                    throw new Error("Union columns from pos " + i + " do not match! \nFirst call columns:   '" + this._unionColumnOrder.join(", ") + "'. \nCurrent call columns: '" + order.join(", ") + "'")
                }
                i++;
            }
            if (i !== this._unionColumnOrder.length) {
                throw new Error("Union columns count do not match! " + this._unionColumnOrder.length + " != " + i + " (Why didn't compiler warn you about this?)");
            }
            this.unions.push("UNION " + (type === "" ? "" : "ALL ") + "(\n" + sql + ") ")
        }
    }

    public with(table: AnyAliasedTableDef): void {
        const alias = table[DbUtility.SQL_ALIAS]
        this._withQueries.set(alias, Sql.escapeId(alias) + " AS " + table[DbUtility.SQL_EXPRESSION])
    }

    public from(table: AnyAliasedTableDef): void {
        this._from = table[DbUtility.SQL_EXPRESSION] + " as " + Sql.escapeId(table[DbUtility.SQL_ALIAS]);
    }

    public forUpdate() {
        this._forUpdate = true;
    }

    public join(joinType: "JOIN" | "LEFT JOIN", table: AnyAliasedTableDef, condition: AnyExpr): void {
        const sql = this._withQueries.has(table[DbUtility.SQL_ALIAS]) ? Sql.escapeId(table[DbUtility.SQL_ALIAS]) : table[DbUtility.SQL_EXPRESSION] + " as " + Sql.escapeId(table[DbUtility.SQL_ALIAS])
        this._joins.push(joinType + " " + sql + " ON (" + condition.expression + ")")
        return this as any;
    }

    public distinct() {
        this._distinct = true;
    }

    public columns(cols: AnyExpr[]): void {
        const columns = cols as unknown as SqlExpression<string, string, any, never>[]
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            this._columns.push(col.expression + (col.nameAs ? " as " + Sql.escapeId(col.nameAs) : ""));
            (this._columnStruct as any)[col.nameAs] = true;
        }
    }

    public where(col: AnyExpr): void {
        if (col && col.expression) {
            this._where.push(col.expression)
        }
    }

    public groupBy(items: (string | AnyExpr)[]): void {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            this._groupBy.push(typeof item === "string" ? item : item.expression)
        }
    }

    public having(items: AnyExpr[]): void {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            this._having.push(typeof item === "string" ? item : item.expression)
        }
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
        let base: string;
        if (this.unions.length > 0) {
            base = this.unions.join("") + "\n";
        } else {
            base = (this._withQueries.size > 0 ? tabs + "WITH\n" + TAB + Array.from(this._withQueries.values()).join(",\n\n" + TAB) + "\n\n" : "") +
                tabs + "SELECT " + (this._distinct ? " DISTINCT " : "") + "\n" +
                tabs + TAB + this._columns.join(",\n" + tabs + TAB) + "\n" +
                tabs + "FROM " + this._from + "\n" +
                (this._joins.length > 0 ? tabs + this._joins.join("\n") + "\n" : "") +
                (this._where.length > 0 ? tabs + "WHERE " + this._where.join("\n" + TAB + " AND ") + "\n" : "")
        }

        return base +
            (this._groupBy.length > 0 ? tabs + "GROUP BY " + this._groupBy.join(", ") + "\n" : "") +
            (this._having.length > 0 ? tabs + "HAVING " + this._having.join("\n" + TAB + " AND ") + "\n" : "") +
            (this._orderBy.length > 0 ? tabs + "ORDER BY " + this._orderBy.join(", ") + "\n" : "") +
            (this._limit ? tabs + "LIMIT " + this._limit + "\n" : "") +
            (this._forUpdate && this.unions.length === 0 ? tabs + " FOR UPDATE\n" : "");
    }

    public async exec(ctx: CTX): Promise<any[]> {
        return this._exec(ctx, this.toString());
    }

    public async execOne(ctx: CTX): Promise<any> {
        return (await this._exec(ctx, this.toString()))?.[0];
    }
}