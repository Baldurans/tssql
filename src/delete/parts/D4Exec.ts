import {SqlQuery} from "../../Types";
import {SQL_ENTITY} from "../../Symbols";
import {DeleteBuilder} from "../DeleteBuilder";


export function getExecDeleteMethods(builder: DeleteBuilder): ExecDeleteMethods {
    return {
        [SQL_ENTITY]: undefined,
        toString: (lvl: number = 0) => {
            return builder.toString(lvl)
        }
    }
}

export interface ExecDeleteMethods extends SqlQuery<{ affectedRows: number }> {

    toString(lvl?: number): string

}
