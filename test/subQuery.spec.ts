import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";

test("simple", async () => {

    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = db.tables.user("c")
    const c2 = db.tables.user("c2")
    const s = db.tables.user("s")

    const joinSub = db
        .uses(c)
        .uses(c2)
        .select()
        .from(s)
        .columns(s.id, s.id.as("subIdRenamed"))
        .where(s.id.EQC(c.id))
        .where(c2.id.EQC(s.id))
        .as("joinSub")

    const query = db
        .select()
        .from(c)
        .join(c2, c2.id, c.id)
        .leftJoin(joinSub, joinSub.id, c.id)
        .columns(
            c.id,
            joinSub.id.as("subId"),
            db.uses(c).select().from(s).columns(s.id).where(s.id.EQC(c.id)).asColumn("subColumn"),
        )
        .whereEq(c.id, input.userId) // c.id = 10
        .where(c.id.EQ(input.userId)) // c.id = 10
        .whereEq(c.name, null) // c.id IS NULL

    console.log(query.toString())

    const res = await query.execOne();
    console.log(
        res.subColumn, // type tUserId
        res.id,  // type tUserId
        res.subId,  // type tUserId
    )

});
