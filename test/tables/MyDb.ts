import {User, UserRowForEdit} from "./User";
import {Company, CompanyForEdit} from "./Company";
import {MysqlTable} from "../../src/MysqlTable";
import {InsertRow} from "../../src";

export class MyDb {

    public static user = new MysqlTable<"user", User, InsertRow<UserRowForEdit, User>>("user", {
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

    public static company = new MysqlTable<"company", Company, InsertRow<CompanyForEdit, Company>>("company", {
        id: true,
        name: true,
    })

}
