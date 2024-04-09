import {DeleteBuilder} from "../DeleteBuilder";
import {escape, escapeId} from "../../escape";
import {GatewayDeleteOrderByMethods, getGatewayDeleteOrderByMethods} from "./D2OrderBy";

export function getGatewayDeleteWhereMethods<Entity, Tables>(builder: DeleteBuilder): GatewayDeleteWhereMethods<Entity> {
    return {
        where: (col: any) => {
            for (const prop in col) {
                const value = col[prop];
                builder.where(escapeId(prop) + "=" + escape(value));
            }
            return getGatewayDeleteOrderByMethods(builder)
        }
    }
}

export interface GatewayDeleteWhereMethods<Entity> {

    where(c1: Partial<Entity>): GatewayDeleteOrderByMethods<Entity>
}
