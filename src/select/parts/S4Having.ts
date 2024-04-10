import {AliasedTable, isColumnOkToUse, Key, NotUsingWithPart, SQL_BOOL} from "../../Types";
import {Expr} from "../../SqlExpression";
import {OrderByMethods} from "./S5OrderBy";
import {LimitMethods} from "./S6Limit";
import {ExecMethods} from "./S7Exec";

export interface HavingMethods<Result, Tables, CTX> extends OrderByMethods<Result, Tables, CTX>, LimitMethods<Result, CTX>, ExecMethods<Result, CTX> {
    having<
        TableRef,
        Columns extends (Expr<TableRef, string | unknown, SQL_BOOL>)[]
    >(
        ...col: isColumnOkToUse<Tables, Columns>
    ): OrderByMethods<Result, Tables, CTX>

    havingF<
        TableRef,
        Columns extends Expr<TableRef, string | unknown, SQL_BOOL>[]
    >(
        func: (columnsTable: AliasedTable<"(columns)", "(columns)", Result, NotUsingWithPart>) => isColumnOkToUse<Tables & Key<"(columns)">, Columns>
    ): OrderByMethods<Result, Tables, CTX> & LimitMethods<Result, CTX>
}



