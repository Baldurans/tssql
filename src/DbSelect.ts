import {
    AliasedTable,
    CheckForDuplicateColumns,
    CheckIfAliasedTablesAreReferenced,
    CheckIfAliasIsAlreadyUsed,
    COMPARISONS,
    ExtractObj,
    OrderByStructure,
    R,
    ScalarSubQueryAllowsOnlyOneColumn,
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
export class DbSelect<Result, UsedAliases, Tables, UsedTables, LastType> {

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
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns>>
    ): DbSelect<Result, UsedAliases & R<Alias>, Tables & R<TableRef>, UsedTables, LastType> {
        if (typeof table === "string") { // This is pretty much to satisfy typescript issue, not really needed for practical purposes.
            throw new Error("Invalid argument! Got '" + typeof table + "'")
        }
        this._from = table[Db.SQL_EXPRESSION];
        return this as any;
    }

    public uses<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns>>
    ): DbSelect<Result, UsedAliases & R<Alias>, Tables & R<TableRef>, UsedTables & R<TableRef>, LastType>
    public uses(table: any): any {
        // This does nothing, it used only for Typescript type referencing.
        return this;
    }

    public _join<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns,
        Field1Type extends string | number,
        Field2Alias extends string & keyof UsedAliases,
        Field2TableName extends string,
        Field2TableRef extends `${Field2TableName} as ${Field2Alias}`,
        Field2Type extends Field1Type
    >(
        joinType: "JOIN" | "LEFT JOIN",
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns>>,
        field1: Value<TableRef, string, Field1Type>,
        field2: Value<Field2TableRef, string, Field2Type>
    ): DbSelect<Result, UsedAliases & R<Alias>, Tables & R<TableRef>, UsedTables, LastType> {
        if (typeof table === "string") { // This is pretty much to satisfy typescript issue, not really needed for practical purposes.
            throw new Error("Invalid argument! Got '" + typeof table + "'")
        }
        this._joins.push(joinType + " " + table[Db.SQL_EXPRESSION] + " ON (" + field1.expression + " = " + field2.expression + ")")
        return this as any;
    }

    public join<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns,
        Field1Type extends string | number,
        Field2Alias extends string & keyof UsedAliases,
        Field2TableName extends string,
        Field2TableRef extends `${Field2TableName} as ${Field2Alias}`,
        Field2Type extends Field1Type
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns>>,
        field1: Value<TableRef, string, Field1Type>,
        field2: Value<Field2TableRef, string, Field2Type>
    ): DbSelect<Result, UsedAliases & R<Alias>, Tables & R<TableRef>, UsedTables, LastType> {
        return this._join("JOIN", table, field1, field2)
    }

    public leftJoin<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns,
        Field1Type extends string | number,
        Field2Alias extends string & keyof UsedAliases,
        Field2TableName extends string,
        Field2TableRef extends `${Field2TableName} as ${Field2Alias}`,
        Field2Type extends Field1Type
    >(
        table: CheckIfAliasIsAlreadyUsed<UsedAliases, Alias, AliasedTable<Alias, TableRef, Columns>>,
        field1: Value<TableRef, string, Field1Type>,
        field2: Value<Field2TableRef, string, Field2Type>
    ): DbSelect<Result, UsedAliases & R<Alias>, Tables & R<TableRef>, UsedTables, LastType> {
        return this._join("LEFT JOIN", table, field1, field2)
    }

    public columns_WITH_CTRL_CLICK_CAPABILITY_BUT_WITHOUT_DUPLICATE_CHECK<
        TableRef extends string & keyof Tables,
        Columns extends Value<TableRef, string, string | number>[]
    >(
        ...columns: Columns
    ): DbSelect<Result & ExtractObj<Columns>, UsedAliases, Tables, UsedTables, Columns[number]["type"]> {
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i] as SqlExpression<string, string, any>;
            this._columns.push(col.toString());
            (this._columnStruct as any)[col.nameAs] = true;
        }
        return this as any;
    }

    public columns_WITH_DUPLICATE_CHECK<
        TableRef extends string & keyof Tables,
        Columns extends Value<TableRef, string, string | number>[]
    >(
        ...columns: CheckForDuplicateColumns<Columns, Result>
    ): DbSelect<Result & ExtractObj<Columns>, UsedAliases, Tables, UsedTables, Columns[number]["type"]> {
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i] as SqlExpression<string, string, any>;
            this._columns.push(col.toString());
            (this._columnStruct as any)[col.nameAs] = true;
        }
        return this as any;
    }

    public where<
        UsedTables2 extends string
    >(
        col: CheckIfAliasedTablesAreReferenced<Tables, R<UsedTables2>, Value<UsedTables2, unknown, string | number>>
    ): this {
        if (typeof col === "string") { // This is pretty much to satisfy typescript issue, not really needed for practical purposes.
            throw new Error("Invalid argument! Got '" + typeof col + "'")
        }
        this._where.push(col.toString())
        return this
    }

    public whereEq<
        TableRef extends string & keyof Tables,
        Type extends string | number,
    >(
        field: Value<TableRef, string, Type>,
        value: Type
    ): this {
        return this.where(SQL.COMPARE<any, Type>(field, "=", value));
    }

    public whereCompare<
        TableRef extends string & keyof Tables,
        Type extends string | number,
    >(
        field: Value<TableRef, string, Type>,
        op: COMPARISONS,
        value: Type
    ): this {
        return this.where(SQL.COMPARE<any, Type>(field, op, value));
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

    public as<Alias extends string>(alias: Alias): AliasedTable<Alias, `(SUBQUERY) as ${Alias}`, Result> {
        return Db.defineDbTable<"(SUBQUERY)", Alias, Result>("(\n" + this.toString(TAB + TAB) + TAB + ")" as "(SUBQUERY)", alias, this._columnStruct)
    }

    public toString(tabs: string = ""): string {
        return tabs + "SELECT " + (this._distinct ? " DISTINCT " : "") + "\n" +
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

    public exec(): Promise<Result[]> {
        // @TODO
        return undefined;
    }

    public execOne<ExpectedResult>(): Promise<Result> {
        console.log(this.toString())
        return {} as any; // @TODO
    }
}
