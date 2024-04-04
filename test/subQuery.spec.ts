import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";

test("simple", async () => {

    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = db.tables.user("c")
    const c2 = db.tables.user("c2")
    const s = db.tables.user("s")

    const scalarSub = db
        .uses(c)
        .select()
        .from(s)
        .columns(s.id)
        //.where(["a","b"])
        .where(
            c.id.eq(c.id),
            s.id.eq(c.id),
            c.id.eq(c.id)
        )
        .noLimit()
        .asScalar("subColumn");

    const joinSub = db
        .uses(c)
        .uses(c2)
        .select()
        .from(s)
        .columns(s.id, s.id.as("subIdRenamed"))
        .where(
            s.id.eq(c.id),
            c2.id.eq(s.id)
        )
        .noLimit()
        .as("joinSub")

    const query = db
        .select()
        .from(c)
        .join(c2, c2.id, c.id)
        .leftJoin(joinSub, joinSub.id, c.id)
        .columns(
            c.id,
            joinSub.id.as("subId"),
            scalarSub,
        )
        .where(
            c.id.is(input.userId),
            c.username.isNull(),
            c.id.is(input.userId)
        )
        .noLimit()

    console.log(query.toString())

    const res = await query.execOne(undefined);
    console.log(
        res.subColumn, // type tUserId
        res.id,  // type tUserId
        res.subId,  // type tUserId
    )

});
