import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";

test("with", async () => {

    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = db.tables.user("c")
    const c2 = db.tables.user("c2")
    const s = db.tables.user("s")

    const part1 = db
        .select()
        .from(s)
        .columns(s.id, s.id.as("subIdRenamed"))
        .where(s.id.EQ(10 as tUserId))
        .as("part1")
    const part1Sub1 = MyDb.createRef(part1, "part1Sub1");
    const part1Sub2 = MyDb.createRef(part1, "part1Sub2");

    const part2 = db
        .select()
        .from(s)
        .columns(s.id)
        .as("part2")
    const part2Sub1 = MyDb.createRef(part2, "part2Sub1")

    const query = db
        .with(part1)
        .with(part2)
        .select()
        .from(c)
        .join(c2, c2.id, c.id)
        .join(part1Sub1, part1Sub1.id, c.id)
        .join(part1Sub2, part1Sub2.id, c.id)
        .join(part2Sub1, part2Sub1.id, c.id)
        .columns(
            c.id,
            part1Sub1.id.as("aa1"),
            part1Sub1.subIdRenamed.as("aa1X"),
            part1Sub2.id.as("aa2"),
            part2Sub1.id.as("aa3"),
        )
        .whereEq(c.id, input.userId) // c.id = 10
        .where(c.id.EQ(input.userId)) // c.id = 10
        .whereEq(c.username, null) // c.id IS NULL

    console.log(query.toString())

    const res = await query.execOne();
    console.log(
        res.id,  // type tUserId
        res.aa1X,
        res.aa1,
        res.aa2,
        res.aa3
    )

});
