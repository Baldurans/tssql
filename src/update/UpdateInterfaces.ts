import {SqlQuery} from "../Types";

export interface GatewayUpdateWhereMethods<Entity, CTX> {

    where(obj: Partial<Entity>): GatewayUpdateOrderByMethods<Entity, CTX>

}

export interface GatewayUpdateOrderByMethods<Entity, CTX> extends UpdateLimitMethods<CTX> {

    orderBy(fields: keyof Entity): UpdateLimitMethods<CTX>

}

export interface UpdateLimitMethods<CTX> {
    noLimit(): ExecUpdateMethods<CTX>

    limit(limit: number | [number, number]): ExecUpdateMethods<CTX>

    limit1(): ExecUpdateMethods<CTX>
}

export interface ExecUpdateMethods<CTX> extends SqlQuery<UpdateResult> {

    toString(lvl?: number): string

    exec(ctx: CTX): Promise<UpdateResult>;

}

export interface UpdateResult {
    affectedRows: number
};
