import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {Sql} from "../src";

test("short", async () => {
    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}
    const c = db.tables.user("c")
    const c2 = db.tables.user("c2")
    String(c2);

    const query = db
        .select()
        .forUpdate()
        .from(c)
        .distinct()
        .columns(
            c.username.as("username2"),
            Sql.value(10).as("sdfaf")
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
    const res = await query.execOne(undefined)

    console.log(
        res.username2
    )

});

