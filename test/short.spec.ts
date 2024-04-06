import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";

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
        )
        .where(c.id.is(input.userId))
        .groupByF(r => [
            r.username2,
            c.username,
            // c2.username
        ])
        .havingF(r => [
            r.username2.is("asdf"),
            c.username.is("adsf"),
            // c2.username.is("adsfafs")
        ])
        .orderByF(r => [
            r.username2, "asc",
            c.username,
            // c2.username
        ])
        .noLimit()

    console.log(query.toString())
    const res = await query.execOne(undefined)

    console.log(
        res.username2
    )

});

