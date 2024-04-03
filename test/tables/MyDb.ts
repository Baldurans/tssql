import {User} from "./User";
import {Company} from "./Company";
import {Db} from "../../src/Db";

export class MyDb extends Db {

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

    public async query(query: string): Promise<any> {
        return [{}]
    }

}
