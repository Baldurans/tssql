import {escape, escapeId} from "../escape";
import {ExecInsertMethods} from "./InsertInterfaces";
import {SQL_ENTITY} from "../Symbols";

export class InsertBuilder implements ExecInsertMethods {

    public readonly [SQL_ENTITY]: undefined; // never used

    private _tableName: string;
    private _set: string[] = []

    public to(tableName: string) {
        this._tableName = tableName;
        return this;
    }

    public set(obj: any) {
        for (const prop in obj) {
            this._set.push(escapeId(prop) + " = " + escape(obj[prop]));
        }
        return this;
    }

    public toString() {
        return "INSERT INTO " + this._tableName + " " +
            (this._set.length > 0 ? "SET \n " + this._set.join(",\n") + "\n" : "");
    }
}