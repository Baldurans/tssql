import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {VALUE} from "../src";
import {SQL} from "../src/SQL";
import {execOne} from "./tables/exec";

test("short", async () => {
    const input: { userId: tUserId } = {userId: 10 as tUserId}
    const c = MyDb.user.as("c")
    const c2 = MyDb.user.as("c2")
    String(c2);

    const query = SQL
        .selectFrom(c)
        .distinct()
        .columns(
            c.username.as("username2"),
            VALUE(10).as("sdfaf")
        )
        .where(c.id.eq(input.userId))
        .groupByF(r => [
            r.username2,
            c.username,
            // c2.username // ERROR
        ])
        .havingF(r => [
            r.username2.eq("asdf"),
            c.username.eq("adsf"),
            // c2.username.is("adsfafs")  // ERROR
        ])
        .orderByF(r => [
            r.username2, "asc",
            c.username,
            // c2.username  // ERROR
        ])
        .noLimit()

    console.log(query.toString())
    const res = await execOne(query)

    console.log(
        res.username2
    )

});

