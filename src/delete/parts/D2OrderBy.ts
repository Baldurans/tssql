import {OrderByStructure} from "../../Types";
import {Expr} from "../../SqlExpression";
import {isColumnOkToUse} from "../../select/parts/S3GroupBy";
import {DeleteLimitMethods, getDeleteLimitMethods} from "./D3Limit";
import {DeleteBuilder} from "../DeleteBuilder";

export function getDeleteOrderByMethods<Tables>(builder: DeleteBuilder): DeleteOrderByMethods<Tables> {
    return {
        orderBy: (...items: any) => {
            builder.orderBy(items as any);
            return getDeleteLimitMethods(builder)
        },
        ...getDeleteLimitMethods(builder),
    }
}

export interface DeleteOrderByMethods<Tables> extends DeleteLimitMethods {
    orderBy<
        TableRef,
        Columns extends OrderByStructure<Expr<TableRef, string | unknown, any>>
    >(
        ...items: isColumnOkToUse<Tables, Columns>
    ): DeleteLimitMethods
}
