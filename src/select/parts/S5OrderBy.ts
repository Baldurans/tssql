import {AliasedTable, isColumnOkToUse, Key, NotUsingWithPart, OrderByStructure} from "../../Types";
import {LimitMethods} from "./S6Limit";
import {Expr} from "../../SqlExpression";
import {ExecMethods} from "./S7Exec";

export interface OrderByMethods<Result, Tables, CTX> extends LimitMethods<Result, CTX>, ExecMethods<Result, CTX> {
    orderBy<
        TableRef,
        Columns extends OrderByStructure<Expr<TableRef, string | unknown, any>>
    >(
        ...items: isColumnOkToUse<Tables, Columns>
    ): LimitMethods<Result, CTX>

    orderByF<
        TableRef,
        Columns extends OrderByStructure<Expr<TableRef, string | unknown, string | number>>
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): LimitMethods<Result, CTX>

}
