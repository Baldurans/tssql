import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";

test("with", async () => {

    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = db.tables.user("c")

    const q1 = db.select().from(c).columns(c.username, c.id).where(c.id.EQ(input.userId)).noLimit()
    const q2 = db.select().from(c).columns(c.username, c.id,).where(c.id.EQ(input.userId)).noLimit()
    const q3 = db.select().from(c).columns(c.username, c.id).where(c.id.EQ(input.userId)).noLimit()

    const union = db
        .union(q1)
        .all(q2)
        .all(q3)
        .groupBy()
        .orderBy("id")
        .limit(10)
        .as("x")

    const b = db.select()
        .from(union)
        .columns(union.id, union.username)
        .where(union.id.EQ(10 as tUserId))
        .noLimit()

    console.log(b.toString())

    const res = await b.execOne();
    console.log(
        res.id,  // type tUserId
    )

});
