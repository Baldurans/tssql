import {User} from "./User";
import {Company} from "./Company";
import {MysqlTable} from "../../src/MysqlTable";

export class MyDb {

    public static user = new MysqlTable<"user", User>("user", {
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

    public static company = new MysqlTable<"company", Company>("company", {
        id: true,
        name: true,
    })

}
