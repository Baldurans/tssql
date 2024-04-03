import {Db} from "./Db";
import {DbSelectParts} from "./DbSelectParts";

/**
 * Format of UsedAliases: {} & Record<"a", true> & Record<"b", true> & ...
 * Format of Tables: {} & Record<"a.user", true> & Record<"b.company", true> & ...
 * Format of UsedTables: {} & Record<"a.user", true> & Record<"b.company", true> & ...
 * Format of Result: {} & Record<"a.user", true> & Record<"b.company", true> & ...
 * LastType is just lastType that was seen via column calls. It has a specific usecase :)
 */
export class DbSelect {

    protected readonly parts: DbSelectParts
    protected readonly db: Db;

    constructor(db: Db, parts: DbSelectParts) {
        this.db = db;
        this.parts = parts;
    }

}
