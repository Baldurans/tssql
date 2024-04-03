import {DbTableDefinition} from "./Db";

const TAB = "  ";

export class DbSelectParts {

    public _withQueries: Map<string, string>
    public _from: string;
    public readonly _columns: string[] = [];
    public readonly _columnStruct: DbTableDefinition<any> = {} as any;
    public readonly _joins: string[] = []
    public readonly _where: string[] = []
    public readonly _having: string[] = [];
    public readonly _groupBy: string[] = [];
    public readonly _orderBy: string[] = []
    public _limit: string = ""

    public _distinct: boolean = false;
    public _forUpdate: boolean = false;


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
}