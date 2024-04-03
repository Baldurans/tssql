import {
    AliasedTable,
    CheckForDuplicateColumns,
    CheckIfAliasedTablesAreReferenced,
    CheckIfAliasIsAlreadyUsed,
    COMPARISONS,
    ExtractObj,
    NOT_REFERENCED,
    OrderByStructure,
    R,
    ScalarSubQueryAllowsOnlyOneColumn,
    SQL_BOOL,
    Value
} from "./Types";
import {SQL} from "./SQL";
import {Db, DbTableDefinition} from "./Db";
import {SqlExpression} from "./SqlExpression";

const TAB = "  ";

/**
 * Format of UsedAliases: {} & Record<"a", true> & Record<"b", true> & ...
 * Format of Tables: {} & Record<"a.user", true> & Record<"b.company", true> & ...
 * Format of UsedTables: {} & Record<"a.user", true> & Record<"b.company", true> & ...
 * Format of Result: {} & Record<"a.user", true> & Record<"b.company", true> & ...
 * LastType is just lastType that was seen via column calls. It has a specific usecase :)
 */
export class DbSelect<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType> {

    private _withQueries: Map<string, string>
    private _from: string;
    private readonly _columns: string[] = [];
    private readonly _columnStruct: DbTableDefinition<Result> = {} as any;
    private readonly _joins: string[] = []
    private readonly _where: string[] = []
    private readonly _having: string[] = [];
    private readonly _groupBy: string[] = [];
    private readonly _orderBy: string[] = []
    private _limit: string = ""

    private _distinct: boolean = false;
    private _forUpdate: boolean = false;

    private readonly db: Db;

    constructor(db: Db, withQueries?: Map<string, string>) {
        this.db = db;
        this._withQueries = withQueries || new Map()
    }

    public distinct(): this {
        this._distinct = true;
        return this;
    }

    public forUpdate(): this {
        this._forUpdate = true;
        return this;
    }

    public from<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>>
    ): DbSelect<Result, UsedAliases & R<Alias>, WithAliases, Tables & R<TableRef>, UsedTables, LastType> {
        if (typeof table === "string") { // This is pretty much to satisfy typescript issue, not really needed for practical purposes.
            throw new Error("Invalid argument! Got '" + typeof table + "'")
        }
        this._from = table[Db.SQL_EXPRESSION] + " as " + SQL.escapeId(table[Db.SQL_ALIAS]);
        return this as any;
    }

    public _join<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        RefAlias extends NOT_REFERENCED | string & keyof WithAliases,
        Columns,
        Field1Type extends string | number,
        Field2Alias extends string & keyof UsedAliases,
        Field2TableName extends string,
        Field2TableRef extends `${Field2TableName} as ${Field2Alias}`,
        Field2Type extends Field1Type
    >(
        joinType: "JOIN" | "LEFT JOIN",
        table: CheckIfAliasIsAlreadyUsed<UsedAliases & WithAliases, Alias, AliasedTable<Alias, TableRef, Columns, RefAlias>>,
        field1: Value<TableRef, string, Field1Type>,
        field2: Value<Field2TableRef, string, Field2Type>
    ): DbSelect<Result, UsedAliases & R<Alias>, WithAliases, Tables & R<TableRef>, UsedTables, LastType> {
        if (typeof table === "string") { // This is pretty much to satisfy typescript issue, not really needed for practical purposes.
            throw new Error("Invalid argument! Got '" + typeof table + "'")
        }
        const sql = this._withQueries.has(table[Db.SQL_ALIAS]) ? SQL.escapeId(table[Db.SQL_ALIAS]) : table[Db.SQL_EXPRESSION] + " as " + SQL.escapeId(table[Db.SQL_ALIAS])
        this._joins.push(joinType + " " + sql + " ON (" + field1.expression + " = " + field2.expression + ")")
        return this as any;
    }

    public join<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        RefAlias extends NOT_REFERENCED | string & keyof WithAliases,
        Columns,
        Field1Type extends string | number,
        Field2Alias extends string & keyof UsedAliases,
        Field2TableName extends string,
        Field2TableRef extends `${Field2TableName} as ${Field2Alias}`,
        Field2Type extends Field1Type
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases & WithAliases, Alias, AliasedTable<Alias, TableRef, Columns, RefAlias>>,
        field1: Value<TableRef, string, Field1Type>,
        field2: Value<Field2TableRef, string, Field2Type>
    ): DbSelect<Result, UsedAliases & R<Alias>, WithAliases, Tables & R<TableRef>, UsedTables, LastType> {
        return this._join("JOIN", table, field1, field2)
    }

    public leftJoin<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        RefAlias extends NOT_REFERENCED | string & keyof WithAliases,
        Columns,
        Field1Type extends string | number,
        Field2Alias extends string & keyof UsedAliases,
        Field2TableName extends string,
        Field2TableRef extends `${Field2TableName} as ${Field2Alias}`,
        Field2Type extends Field1Type
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases & WithAliases, Alias, AliasedTable<Alias, TableRef, Columns, RefAlias>>,
        field1: Value<TableRef, string, Field1Type>,
        field2: Value<Field2TableRef, string, Field2Type>
    ): DbSelect<Result, UsedAliases & R<Alias>, WithAliases, Tables & R<TableRef>, UsedTables, LastType> {
        return this._join("LEFT JOIN", table as any, field1, field2)
    }

    public columns<
        TableRef extends string & keyof Tables,
        Columns extends Value<TableRef, string, string | number>[]
    >(
        //...columns: Columns - this will enable seeing sources of Result object properties.
        ...columns: CheckForDuplicateColumns<Columns, Result>
    ): DbSelect<Result & ExtractObj<Columns>, UsedAliases, WithAliases, Tables, UsedTables, Columns[number]["type"]> {
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i] as unknown as SqlExpression<string, string, any>;
            this._columns.push(col.toString());
            (this._columnStruct as any)[col.nameAs] = true;
        }
        return this as any;
    }

    public where<
        UsedTables2 extends string
    >(
        col: CheckIfAliasedTablesAreReferenced<Tables, R<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
    ): this {
        if (typeof col === "string") { // This is pretty much to satisfy typescript issue, not really needed for practical purposes.
            throw new Error("Invalid argument! Got '" + typeof col + "'")
        }
        if (col !== undefined) {
            this._where.push(col.toString())
        }
        return this
    }

    public whereEq<
        TableRef extends string & keyof Tables,
        Type extends string | number,
    >(
        col: Value<TableRef, string, Type>,
        value: Type
    ): this {
        if (col !== undefined) {
            this.where(SQL.COMPARE<any, Type>(col, "=", value));
        }
        return this
    }

    public whereCompare<
        TableRef extends string & keyof Tables,
        Type extends string | number,
    >(
        col: Value<TableRef, string, Type>,
        op: COMPARISONS,
        value: Type
    ): this {
        if (col !== undefined) {
            this.where(SQL.COMPARE<any, Type>(col, op, value));
        }
        return this
    }

    public groupBy<
        TableRef extends string & keyof Tables,
        Str extends string & keyof Result
    >(
        ...items: (Str | Value<TableRef, string | unknown, string | number>)[]
    ): this {
        for (let i = 0; i < items.length; i++) {
            this._groupBy.push(String(items[i]))
        }
        return this;
    }

    public orderBy<
        TableRef extends string & keyof Tables,
        Str extends string & keyof Result
    >(
        ...items: OrderByStructure<(Str | Value<TableRef, string | unknown, string | number>), "asc" | "ASC" | "desc" | "DESC">
    ): this {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item === "asc" || item === "ASC" || item === "desc" || item === "DESC") {
                this._orderBy[this._orderBy.length - 1] += " " + item;
            } else {
                this._orderBy.push(String(item))
            }
        }
        return this;
    }

    public limit(limit: number | [number, number]): this {
        if (Array.isArray(limit)) {
            this._limit = SQL.escape(limit[0]) + "," + SQL.escape(limit[1]);
        } else {
            this._limit = SQL.escape(limit);
        }
        return this;
    }

    public asColumn<Alias extends string>(alias: Alias & ScalarSubQueryAllowsOnlyOneColumn<Alias, Result> extends never ? "Scalar subquery allows only 1 column!" : Alias): Value<keyof UsedTables & string, Alias, LastType> {
        return SqlExpression.create("(\n" + this.toString(TAB + TAB) + TAB + ")", alias);
    }

    public as<Alias extends string>(alias: Alias): AliasedTable<Alias, `(SUBQUERY) as ${Alias}`, Result, NOT_REFERENCED> {
        return Db.defineDbTable<"(SUBQUERY)", Alias, Result>("(\n" + this.toString(TAB + TAB) + TAB + ")" as "(SUBQUERY)", alias, this._columnStruct)
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

    public async exec(): Promise<Result[]> {
        return this.db.query(this.toString());
    }

    public async execOne<ExpectedResult>(): Promise<Result> {
        return (await this.db.query(this.toString()))?.[0];
    }
}
