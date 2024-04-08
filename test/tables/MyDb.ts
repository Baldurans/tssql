import {User} from "./User";
import {Company} from "./Company";
import {SQL} from "../../src";

export class MyDb {

    public static user = SQL.getDbTableAliasFunction<"user", User>("user", {
        id: true,
        username: true,
        age: true,
        isMan: true,
        created: true,
        updated_at: true,
        tin: true,
        created_at: true,
        uuid: true
    })

    public static company = SQL.getDbTableAliasFunction<"company", Company>("company", {
        id: true,
        name: true,
    })

}
