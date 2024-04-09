import {SqlQuery} from "../Types";

export interface ExecInsertMethods extends SqlQuery<{ insertId: number }> {

    toString(lvl?: number): string

}
