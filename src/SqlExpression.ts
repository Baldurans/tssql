import {Value} from "./Types";
import {SQL} from "./SQL";

export class SqlExpression<TableRef extends string, Name extends string | unknown, Type extends string | number | unknown> {

    public readonly expression: string;
    public readonly nameAs: string | undefined;

    constructor(expression: string, nameAs: string) {
        this.expression = expression;
        this.nameAs = nameAs;
        Object.freeze(this);
    }

    public static create<TableRef extends string, Name, Type>(expression: string, nameAs?: string | undefined): Value<TableRef, Name, Type> {
        return new SqlExpression(expression, nameAs) as any
    }

    public cast<CastType extends string | number>(): Value<TableRef, Name, CastType> {
        return this as any;
    }

    public as<T extends string>(name: T): Value<TableRef, T, Type> {
        return new SqlExpression<TableRef, T, Type>(this.expression, name) as any;
    }

    public toString() {
        return this.expression + (this.nameAs ? " as " + SQL.escapeId(this.nameAs) : "")
    }

}
