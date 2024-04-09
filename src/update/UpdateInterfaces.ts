import {SqlQuery} from "../Types";

export interface GatewayUpdateWhereMethods<Entity> {

    where(obj: Partial<Entity>): GatewayUpdateOrderByMethods<Entity>

}

export interface GatewayUpdateOrderByMethods<Entity> extends UpdateLimitMethods {

    orderBy(fields: keyof Entity): UpdateLimitMethods

}

export interface UpdateLimitMethods {
    noLimit(): ExecUpdateMethods

    limit(limit: number | [number, number]): ExecUpdateMethods

    limit1(): ExecUpdateMethods
}

export interface ExecUpdateMethods extends SqlQuery<{ affectedRows: number }> {

    toString(lvl?: number): string

}
