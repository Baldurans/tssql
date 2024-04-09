import {AnyExpr, Over, SqlExpression} from "../SqlExpression";
import {SelectBuilder} from "./SelectBuilder";
import {WhereMethods} from "./parts/S2Where";
import {ColumnsMethods} from "./parts/S2Columns";
import {JoinMethods} from "./parts/S1Join";
import {WithMethods} from "./parts/S0With";
import {UsesMethods} from "./parts/S0Uses";
import {UnionMethods} from "./parts/S0Union";
import {GroupByMethods} from "./parts/S3GroupBy";
import {HavingMethods} from "./parts/S4Having";
import {OrderByMethods} from "./parts/S5OrderBy";
import {LimitMethods} from "./parts/S6Limit";
import {ExecMethods} from "./parts/S7Exec";
import {MysqlTable} from "../MysqlTable";
import {SQL_ENTITY} from "../Symbols";

const TAB = "  ";

export class SelectBuilder2<Result, Aliases, AliasesFromWith, Tables> implements UnionMethods<Result>,
    WithMethods<AliasesFromWith>,
    UsesMethods<Aliases, Tables>,
    JoinMethods<Aliases, AliasesFromWith, Tables>,
    ColumnsMethods<Result, Tables>,
    WhereMethods<Result, Tables>,
    GroupByMethods<Result, Tables>,
    HavingMethods<Result, Tables>,
    OrderByMethods<Result, Tables>,
    LimitMethods<Result>,
    ExecMethods<Result> {

    public readonly [SQL_ENTITY]: undefined; // never used

    private readonly builder: SelectBuilder;

    constructor(builder: SelectBuilder) {
        this.builder = builder
    }

    public union(table: any) {
        this.builder.union("DISTINCT", table.toString(1), table.getColumnStruct())
        return this
    }

    public unionAll(table: any) {
        this.builder.union("ALL", table.toString(1), table.getColumnStruct())
        return this
    }

    public with(table: any) {
        this.builder.with(table);
        return this
    }

    public uses(...items: any) {
        return this
    }

    public selectFrom(table: any) {
        this.builder.from(table)
        return this
    }

    public join(table: any, condition: any) {
        this.builder.join("JOIN", table, condition)
        return this
    }

    public leftJoin(table: any, condition: any) {
        this.builder.join("JOIN", table, condition)
        return this
    }

    public window(name: any, func: any) {
        const builder2 = new Over()
        func(builder2)
        this.builder.window(name, builder2.toString())
        return this
    }

    public distinct() {
        this.builder.distinct()
        return this
    }

    public columns(...cols: any[]) {
        this.builder.columns(cols);
        return this
    }

    public noWhere() {
        return this as any
    }

    public where(...cols: any) {
        for (let i = 0; i < cols.length; i++) {
            this.builder.where(cols[i] as unknown as AnyExpr)
        }
        return this as any
    }

    public groupBy(...items: any) {
        this.builder.groupBy(items as any);
        return this as any
    }

    public groupByF(func: any) {
        const proxy: any = new Proxy({}, {
            get(target: {}, p: string, receiver: any): any {
                return new SqlExpression(p, p)
            }
        })
        this.builder.groupBy(func(proxy) as any);
        return this as any
    }

    public having(...col: any) {
        this.builder.having(col as unknown as AnyExpr[])
        return this as any
    }

    public havingF(func: any) {
        const proxy: any = new Proxy({}, {
            get(target: {}, p: string, receiver: any): any {
                return new SqlExpression(p, p)
            }
        })
        this.builder.having(func(proxy) as any);
        return this
    }

    public orderBy(...items: any) {
        this.builder.orderBy(items as any);
        return this as any
    }

    public orderByF(func: any) {
        const proxy: any = new Proxy({}, {
            get(target: {}, p: string, receiver: any): any {
                return new SqlExpression(p, p)
            }
        })
        this.builder.orderBy(func(proxy) as any);
        return this as any
    }

    public noLimit() {
        return this as any
    }

    public limit(limit: number | [number, number]) {
        this.builder.limit(limit);
        return this as any
    }

    public limit1() {
        this.builder.limit(1);
        return this as any
    }

    public forUpdate() {
        this.builder.forUpdate()
        return this as any
    }

    public asScalar(alias: any): any {
        return SqlExpression.create("(\n" + this.builder.toString(2) + TAB + ")", alias);
    }

    public as(alias: any): any {
        return MysqlTable.defineDbTable("(\n" + this.builder.toString(2) + ")" as "(SUBQUERY)", alias, this.builder.getColumnStruct())
    }

    public toString(lvl: number = 0) {
        return this.builder.toString(lvl)
    }

    public getColumnStruct() {
        return this.builder.getColumnStruct()
    }
}