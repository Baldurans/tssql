import {PrepareQueryArgument} from "./Types";
import {escape as libEscape, escapeId as libEscapeId} from "sqlstring";

export function escape(value: string | number | (string | number)[] | PrepareQueryArgument): string {
    return libEscape(value);
}

export function escapeId(value: string): string {
    return libEscapeId(value);
}