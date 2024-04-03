import {AnyValue, CheckIfAliasedTablesAreReferenced, TrueRecord, SQL_BOOL, Value} from "../Types";
import {DbSelect} from "./DbSelect";
import {DbSelect05GroupBy} from "./DbSelect05GroupBy";

export class DbSelect04Where<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType, CTX> extends DbSelect<CTX> {
    public noWhere(): DbSelect05GroupBy<Result, Tables, UsedTables, LastType, CTX> {
        return new DbSelect05GroupBy(this.builder)
    }

    public where<UsedTables2 extends string>(
        col: CheckIfAliasedTablesAreReferenced<Tables, TrueRecord<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
    ): DbSelectWhere2<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType, CTX> {
        this.builder.where(col as AnyValue)
        return new DbSelectWhere2(this.builder)
    }
}

export class DbSelectWhere2<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType, CTX> extends DbSelect05GroupBy<Result, Tables, UsedTables, LastType, CTX> {
    public where<UsedTables2 extends string>(
        col: CheckIfAliasedTablesAreReferenced<Tables, TrueRecord<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
    ): DbSelectWhere2<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType, CTX> {
        this.builder.where(col as AnyValue)
        return new DbSelectWhere2(this.builder)
    }
}
