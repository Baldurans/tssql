import {User} from "./User";
import {Company} from "./Company";
import {Db} from "../../src/Db";

export class MyDb extends Db<undefined> {


    constructor() {
        super(async (sql: string) => {
            return [{}]
        });
    }

    public readonly tables = {
        user: this.getDbTableAliasFunction<"user", User>("user", {
            id: true,
            username: true,
            age: true,
            isMan: true,
            created: true
        }),
        company: this.getDbTableAliasFunction<"company", Company>("company", {
            id: true,
            name: true,
        }),
    };


}
