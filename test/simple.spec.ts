import {tUserId} from "./tables/User";
import {vDate} from "../src/CustomTypes";
import {MyDb} from "./tables/MyDb";
import {SQL} from "../src/SQL";

interface Result {
    id: tUserId,
    name: string | null,
    renamedId: tUserId | null,
    myDate: vDate
    subColumn: tUserId
    subId: tUserId
    //age: string;
}

test("simple", async () => {

    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = db.tables.user("c")
    const c2 = db.tables.user("c2")
    const s = db.tables.user("s")

    const joinSub = db.select()
        .from(s)
        .uses(c)
        .columns_WITH_DUPLICATE_CHECK(s.id, s.created, s.name, s.age)
        .columns_WITH_DUPLICATE_CHECK(s.id.as("subIdRenamed"))
        .where(SQL.EQC(s.id, c.id))
        .as("joinSub")

    const res: Result = await db.select()
        .from(c)
        .join(c2, c2.id, c.id)
        .leftJoin(joinSub, joinSub.id, c.id)
        .columns_WITH_DUPLICATE_CHECK(
            db.select().from(s).uses(c).columns_WITH_DUPLICATE_CHECK(s.id).where(SQL.EQC(s.id, c.id)).asColumn("subColumn"),
            c.name,
            c.id,
            c.id.as("renamedId"),
            SQL.DATE(c.created).as("myDate"),
            SQL.DATE(joinSub.created).as("myDate2"),
            joinSub.id.as("subId"),
        )
        .whereEq(c.id, input.userId) // c.id = 10
        .where(SQL.COMPARE(c.id, "=", input.userId)) // c.id = 10
        .whereEq(c.name, null) // c.id IS NULL
        .execOne()


    console.log(
        res.subColumn, // type tUserId
        res.id,  // type tUserId
        res.name,  // type string
        res.renamedId,  // type tUserId
        res.myDate, // type vDateTime
        res.subId,  // type tUserId
    )

});
