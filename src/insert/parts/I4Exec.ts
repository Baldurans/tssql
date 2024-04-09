import {SqlQuery} from "../../Types";
import {SQL_ENTITY} from "../../Symbols";
import {InsertBuilder} from "../InsertBuilder";


export function getExecInsertMethods(builder: InsertBuilder): ExecInsertMethods {
    return {
        [SQL_ENTITY]: undefined,
        toString: () => {
            return builder.toString()
        }
    }
}

export interface ExecInsertMethods extends SqlQuery<{ insertId: number }> {

    toString(lvl?: number): string

}
