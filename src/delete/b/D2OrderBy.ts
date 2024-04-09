import {DeleteBuilder} from "../DeleteBuilder";
import {DeleteLimitMethods, getDeleteLimitMethods} from "../parts/D3Limit";

export function getGatewayDeleteOrderByMethods<Entity>(builder: DeleteBuilder): GatewayDeleteOrderByMethods<Entity> {
    return {
        orderBy: (...items: any) => {
            builder.orderBy(items as any);
            return getDeleteLimitMethods(builder)
        },
        ...getDeleteLimitMethods(builder),
    }
}

export interface GatewayDeleteOrderByMethods<Entity> extends DeleteLimitMethods {

    orderBy(fields: keyof Entity): DeleteLimitMethods

}
