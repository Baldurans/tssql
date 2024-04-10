import {AliasedTable, isColumnOkToUse, Key, NotUsingWithPart} from "../../Types";
import {HavingMethods} from "./S4Having";
import {Expr} from "../../SqlExpression";
import {OrderByMethods} from "./S5OrderBy";
import {LimitMethods} from "./S6Limit";

export interface GroupByMethods<Result, Tables, CTX> extends OrderByMethods<Result, Tables, CTX>, LimitMethods<Result, CTX> {
    groupBy<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, any>[]
    >(
        ...items: isColumnOkToUse<Tables, Columns>
    ): HavingMethods<Result, Tables, CTX>

    groupByF<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, any>[]
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): HavingMethods<Result, Tables, CTX>
}


