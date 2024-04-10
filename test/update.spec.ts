import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {MAX, SQL} from "../src";

test("update", async () => {


    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = MyDb.user.as("c")
    const c2 = MyDb.user.as("c2")
    const s = MyDb.user.as("s")

    const IGNORE = "IGNORE";

    // --------------------

    MyDb.user
        .update({
            username: "",
            age: 2
        })
        .where({
            id: input.userId
        })
        .orderBy("id")

    const sub = SQL.selectFrom(c)
        .columns(c.id)
        .where(c.isMan.eq(1))
        .as("sub")

    SQL.update(c, sub)
        .set({
            id: MAX(sub.id),
            name: "username2"
        })
        .where(c.id.eq(input.userId))
        .orderBy(c.id)
        .limit(10)

    SQL.update(IGNORE, MyDb.user).set({id: 10, isMan: 20}).where({id: input.userId}).limit1();

    SQL.update(IGNORE, c).set({id: 10, isMan: 20}).where(c.id.eq(input.userId)).limit(5)


});
