import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {SQL} from "../src/SQL";

test("update", async () => {

    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = MyDb.user.as("c")
    const c2 = MyDb.user.as("c2")
    String(c2);

    MyDb.user.insert({
        username: "",
        age: 0,
        isMan: 20,
        uuid: "",
        tin: null,
        created: null
    });
    MyDb.user.insert({
        username: "",
        age: 0
    });

    SQL.insertInto(MyDb.user).set({id: 10, isMan: 20}).onDuplicateKey({})

    SQL.insertInto(MyDb.user).values([{id: 10, isMan: 20}]).onDuplicateKey({})

    SQL.insertIgnoreInto(MyDb.user).select(SQL
        .selectFrom(c)
        .columns(c.id, c.username)
        .where(c.id.eq(input.userId))
    ).onDuplicateKey({})
});
