import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {SQL} from "../src/SQL";

test("with", async () => {

    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = db.tables.user("c")
    const c2 = db.tables.user("c2")
    const s = db.tables.user("s")

    const part1 = db
        .select()
        .from(s)
        .columns(s.id, s.created, s.name, s.age)
        .columns(s.id.as("subIdRenamed"))
        .where(s.id.EQ(10 as tUserId))
        .as("part1")
    const part1Sub1 = MyDb.createRef(part1, "part1Sub1");
    const part1Sub2 = MyDb.createRef(part1, "part1Sub2");

    const part2 = db
        .select()
        .from(s)
        .columns(s.id, s.created, s.name, s.age)
        .columns(s.id.as("subIdRenamed"))
        .where(s.id.EQ(10 as tUserId))
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
            db.uses(c).select().from(s).columns(s.id).where(s.id.EQC(c.id)).asColumn("subColumn"),
            c.name,
            c.id,
            c.id.as("renamedId"),
            SQL.NULL<string>().as("emptyValue"),
            SQL.DATE(c.created).as("myDate"),
            SQL.IF(c.id.EQ(10 as tUserId), c.id, c2.id).as("userIdFromIf"),
            part1Sub1.id.as("aa1"),
            part1Sub2.id.as("aa2"),
            part2Sub1.id.as("aa3"),
        )
        .whereEq(c.id, input.userId) // c.id = 10
        .where(c.id.EQ(input.userId)) // c.id = 10
        .whereEq(c.name, null) // c.id IS NULL

    //SQL.union( select1, select2) // vaata, et select1 ja select2 väljad oleks samad
    //SQL.unionAll( select1, select2) // vaata, et select1 ja select2 väljad oleks samad

    console.log(query.toString())

    const res = await query.execOne();
    console.log(
        res.subColumn, // type tUserId
        res.id,  // type tUserId
        res.name,  // type string
        res.renamedId,  // type tUserId
        res.myDate, // type vDateTime
        res.emptyValue,
        res.userIdFromIf,
        res.aa1,
        res.aa2,
        res.aa3
    )

});
