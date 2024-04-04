import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {Sql} from "../src";

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
        .where(s.id.is(10 as tUserId))
        .noLimit()
        .as("part1")
    const pA1 = MyDb.createRef(part1, "part1Sub1");
    const pA2 = MyDb.createRef(part1, "part1Sub2");

    const part2 = db
        .select()
        .from(s)
        .columns(s.id)
        .noWhere()
        .noLimit()
        .as("part2")
    const pB1 = MyDb.createRef(part2, "part2Sub1")

    const query = db
        .with(part1)
        .with(part2)
        .select()
        .from(c)
        .join(c2, c2.id, c.id)
        .join(pA1, pA1.id, c.id)
        .join(pA2, pA2.id, c.id)
        .join(pB1, pB1.id, c.id)
        .columns(
            c.id,
            pA1.id.as("aa1"),
            pA1.subIdRenamed.as("aa1X"),
            pA2.id.as("aa2"),
            pB1.id.as("aa3"),
        )
        .where(Sql.and(
            c.id.is(input.userId),
            pB1.id.EQ(input.userId)
        ))
        .noLimit()


    console.log(query.toString())

    const res = await query.execOne(undefined);
    console.log(
        res.id,  // type tUserId
        res.aa1X,
        res.aa1,
        res.aa2,
        res.aa3
    )

});
