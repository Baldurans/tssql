import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";

test("with", async () => {

    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = db.tables.user("c")

    const q1 = db.select().from(c).columns(c.username, c.id).where(c.id.EQ(input.userId)).noLimit()
    const q2 = db.select().from(c).columns(c.username, c.id).where(c.id.EQ(input.userId)).noLimit()
    const q3 = db.select().from(c).columns(c.username, c.id).where(c.id.EQ(input.userId)).noLimit()

    const union = db
        .union(q1)
        .all(q2)
        .all(q3)
        .groupBy()
        .orderBy("id")
        .limit(10)

    console.log(union.toString())

    const res = await union.execOne();
    console.log(
        res.id,  // type tUserId
    )

});
