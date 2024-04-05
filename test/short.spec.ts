import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";

test("short", async () => {
    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}
    const c = db.tables.user("c")

    const res = await db
        .select()
        .forUpdate()
        .from(c)
        .distinct()
        .columns(
            c.username,
        )
        .where(c.id.is(input.userId))
        .execOne(undefined);

    console.log(
        res.username
    )

});

