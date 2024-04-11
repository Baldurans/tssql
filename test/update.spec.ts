import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {SQL} from "../src/SQL";
import {MAX} from "../src";

test("update", async () => {


    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = MyDb.user.as("c")
    const c2 = MyDb.user.as("c2")
    const s = MyDb.company.as("s")
    String(c2);
    String(s)

    // --------------------

    // const q1 = MyDb.user
    //     .update({
    //         username: "",
    //         age: 2
    //     })
    //     .where({
    //         id: input.userId
    //     })
    //     .orderBy("id")
    //     .noLimit()
    // console.log(q1.toSqlString());
    //
    // const q2 = SQL.update(c)
    //     .set({
    //         username: "username2"
    //     })
    //     .where(c.id.eq(input.userId))
    //     .orderBy(c.id)
    //     .limit(10)
    // console.log(q2.toSqlString());
    //
    const sub = SQL
        .uses(c)
        .selectFrom(s)
        .columns(s.age)
        .where(s.name.eq(c.username))
        .noLimit()
        .as("sub")

    const q3 = SQL
        .update(c)
        .join(sub)
        .set({
            age: MAX(c.age),
            age3: 12,
            username: "username2",
            //username: 12,
        })
    //     .where(c.id.eq(input.userId))
    //     .orderBy(c.id)
    //     .limit(10)
    // console.log(q3.toSqlString());


});


























