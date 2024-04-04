import {AnyValue, CheckIfAliasedTablesAreReferenced, TrueRecord, SQL_BOOL, Value} from "../Types";
import {DbSelect} from "./DbSelect";
import {DbSelect05GroupBy} from "./DbSelect05GroupBy";

export class DbSelect04Where<Result, UsedAliases, WithAliases, Tables, UsedTables, LastType, CTX> extends DbSelect<CTX> {
    public noWhere(): DbSelect05GroupBy<Result, Tables, UsedTables, LastType, CTX> {
        return new DbSelect05GroupBy(this.builder)
    }

    public where<T1 extends string>(
        col1: CheckIfAliasedTablesAreReferenced<Tables, TrueRecord<T1>, Value<T1, unknown, SQL_BOOL>>
    ): DbSelect05GroupBy<Result, Tables, UsedTables, LastType, CTX>
    public where<T1 extends string, T2 extends string>(
        col1: CheckIfAliasedTablesAreReferenced<Tables, TrueRecord<T1>, Value<T1, unknown, SQL_BOOL>>,
        col2: CheckIfAliasedTablesAreReferenced<Tables, TrueRecord<T1>, Value<T1, unknown, SQL_BOOL>>
    ): DbSelect05GroupBy<Result, Tables, UsedTables, LastType, CTX>
    public where<T1 extends string, T2 extends string, T3 extends string>(
        col1: CheckIfAliasedTablesAreReferenced<Tables, TrueRecord<T1>, Value<T1, unknown, SQL_BOOL>>,
        col2: CheckIfAliasedTablesAreReferenced<Tables, TrueRecord<T2>, Value<T2, unknown, SQL_BOOL>>,
        col3: CheckIfAliasedTablesAreReferenced<Tables, TrueRecord<T3>, Value<T3, unknown, SQL_BOOL>>
    ): DbSelect05GroupBy<Result, Tables, UsedTables, LastType, CTX>

    public where(
        ...cols: any[]
    ): DbSelect05GroupBy<Result, Tables, UsedTables, LastType, CTX> {

        for (let i = 0; i < cols.length; i++) {
            this.builder.where(cols[i] as unknown as AnyValue)
        }
        return new DbSelect05GroupBy(this.builder)
    }
}

// Recursive type to handle same thing, but TS does not recognize that input is a duple, but takes it as (A | B)[], but needed would be [A,B]
// Can use something like this if it improves.
// type CheckThatTablesAreAllAddedToTheQuery<Cols, Tables> = Cols extends [infer A, ...(infer B)]
//     ? [
//         A extends Value<infer UsedTables2, unknown, SQL_BOOL>
//             ? CheckIfAliasedTablesAreReferenced<Tables, TrueRecord<UsedTables2>, Value<UsedTables2, unknown, SQL_BOOL>>
//             : "Invalid argument",
//         ...CheckThatTablesAreAllAddedToTheQuery<B, Tables>
//     ]
//     : []
