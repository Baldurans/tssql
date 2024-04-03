import {Db, DbTableDefinition} from "../Db";
import {SQL} from "../SQL";
import {SqlExpression} from "../SqlExpression";
import {AnyAliasedTableDef, AnyValue, OrderByStructure} from "../Types";
import {DbUtility} from "../DbUtility";

const TAB = "  ";


export class DbSelectBuilder {

    private readonly db: Db;

    private _withQueries: Map<string, string> = new Map()
    private _from: string;
    private readonly _columns: string[] = [];
    private readonly _columnStruct: DbTableDefinition<any> = {} as any;
    private readonly _joins: string[] = []
    private readonly _where: string[] = []
    private readonly _having: string[] = [];
    private readonly _groupBy: string[] = [];
    private readonly _orderBy: string[] = []
    private _limit: string = ""

    private _distinct: boolean = false;
    private _forUpdate: boolean = false;

    constructor(db: Db) {
        this.db = db;
    }

    public getColumnStruct(): DbTableDefinition<any> {
        return this._columnStruct;
    }

    public with(table: AnyAliasedTableDef): void {
        const alias = table[DbUtility.SQL_ALIAS]
        this._withQueries.set(alias, SQL.escapeId(alias) + " AS " + table[DbUtility.SQL_EXPRESSION])
    }

    public from(table: AnyAliasedTableDef): void {
        this._from = table[DbUtility.SQL_EXPRESSION] + " as " + SQL.escapeId(table[DbUtility.SQL_ALIAS]);
    }

    public forUpdate() {
        this._forUpdate = true;
    }

    public join(joinType: "JOIN" | "LEFT JOIN", table: AnyAliasedTableDef, field1: AnyValue, field2: AnyValue): void {
        const sql = this._withQueries.has(table[DbUtility.SQL_ALIAS]) ? SQL.escapeId(table[DbUtility.SQL_ALIAS]) : table[DbUtility.SQL_EXPRESSION] + " as " + SQL.escapeId(table[DbUtility.SQL_ALIAS])
        this._joins.push(joinType + " " + sql + " ON (" + field1.expression + " = " + field2.expression + ")")
        return this as any;
    }

    public distinct() {
        this._distinct = true;
    }

    public columns(cols: AnyValue[]): void {
        const columns = cols as unknown as SqlExpression<string, string, any>[]
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            this._columns.push(col.toString());
            (this._columnStruct as any)[col.nameAs] = true;
        }
    }

    public where(col: AnyValue): void {
        if (col !== undefined) {
            this._where.push(String(col))
        }
    }

    public groupBy(items: (string | AnyValue)[]): void {
        for (let i = 0; i < items.length; i++) {
            this._groupBy.push(String(items[i]))
        }
    }

    public having(col: AnyValue): void {
        if (col !== undefined) {
            this._having.push(col.toString())
        }
    }

    public orderBy(items: OrderByStructure<string | AnyValue, "asc" | "ASC" | "desc" | "DESC">): void {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item === "asc" || item === "ASC" || item === "desc" || item === "DESC") {
                this._orderBy[this._orderBy.length - 1] += " " + item;
            } else if (typeof item === "string") {
                this._orderBy.push(item)
            } else {
                this._orderBy.push(item.nameAs ? SQL.escapeId(item.nameAs as any) : item.expression)
            }
        }
    }

    public limit(limit: number | [number, number]): void {
        if (Array.isArray(limit)) {
            this._limit = Number(limit[0]) + "," + Number(limit[1]);
        } else {
            this._limit = String(Number(limit));
        }
    }

    public toString(tabs: string = ""): string {
        return (this._withQueries.size > 0 ? tabs + "WITH\n" + TAB + Array.from(this._withQueries.values()).join(",\n\n" + TAB) + "\n\n" : "") +
            tabs + "SELECT " + (this._distinct ? " DISTINCT " : "") + "\n" +
            tabs + TAB + this._columns.join(",\n" + tabs + TAB) + "\n" +
            tabs + "FROM " + this._from + "\n" +
            (this._joins.length > 0 ? tabs + this._joins.join("\n") + "\n" : "") +
            (this._where.length > 0 ? tabs + "WHERE " + this._where.join("\n" + TAB + " AND ") + "\n" : "") +
            (this._groupBy.length > 0 ? tabs + "GROUP BY " + this._groupBy.join(", ") + "\n" : "") +
            (this._having.length > 0 ? tabs + "HAVING " + this._having.join("\n" + TAB + " AND ") + "\n" : "") +
            (this._orderBy.length > 0 ? tabs + "ORDER BY " + this._orderBy.join(", ") + "\n" : "") +
            (this._limit ? tabs + "LIMIT " + this._limit + "\n" : "") +
            (this._forUpdate ? tabs + " FOR UPDATE\n" : "");
    }

    public async exec(): Promise<any[]> {
        return this.db.query(this.toString());
    }

    public async execOne(): Promise<any> {
        return (await this.db.query(this.toString()))?.[0];
    }
}