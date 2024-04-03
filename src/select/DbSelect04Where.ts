import {AnyValue, CheckIfAliasedTablesAreReferenced, R, SQL_BOOL, Value} from "../Types";
import {DbSelect} from "./DbSelect";
import {DbSelect05GroupBy} from "./DbSelect05GroupBy";

export class DbSelect04Where<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType> extends DbSelect {
    public noWhere(): DbSelect05GroupBy<Result, Tables, UsedTables, LastType> {
        return new DbSelect05GroupBy(this.builder)
    }

    public where<UsedTables2 extends string>(
        col: CheckIfAliasedTablesAreReferenced<Tables, R<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
    ): DbSelectWhere2<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType> {
        this.builder.where(col as AnyValue)
        return new DbSelectWhere2(this.builder)
    }
}

export class DbSelectWhere2<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType> extends DbSelect05GroupBy<Result, Tables, UsedTables, LastType> {
    public where<UsedTables2 extends string>(
        col: CheckIfAliasedTablesAreReferenced<Tables, R<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
    ): DbSelectWhere2<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType> {
        this.builder.where(col as AnyValue)
        return new DbSelectWhere2(this.builder)
    }
}
