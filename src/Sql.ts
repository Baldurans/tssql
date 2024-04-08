import {PrepareQueryArgument} from "./Types";

export class Sql {

    public static escape(value: string | number | (string | number)[] | PrepareQueryArgument): string {
        throw new Error("Overwrite escape function with your implementation! (for example: Db.escape = mysql.escape)")
    }

    public static escapeId(value: string): string {
        throw new Error("Overwrite escapeId function with your implementation! (for example: Db.escapeId = mysql.escapeId)")
    }

}