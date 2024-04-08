import {User} from "./User";
import {Company} from "./Company";
import {Db} from "../../src/Db";
import {Sql} from "../../src/Sql";

Sql.escape = (value) => {
    return String(value);
};
Sql.escapeId = (value) => {
    return value;
}

export class MyDb extends Db<undefined> {

    constructor() {
        super(async (sql: string) => {
            return [{}]
        });
    }

    public readonly tables = {
        user: Db.getDbTableAliasFunction<"user", User>("user", {
            id: true,
            username: true,
            age: true,
            isMan: true,
            created: true,
            updated_at: true,
            tin: true,
            created_at: true,
            uuid: true
        }),
        company: Db.getDbTableAliasFunction<"company", Company>("company", {
            id: true,
            name: true,
        }),
    };


}
