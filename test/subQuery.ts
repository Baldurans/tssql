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
    emptyValue: string
    userIdFromIf: tUserId
}

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
        .columns(s.id, s.created, s.name, s.age)
        .columns(s.id.as("subIdRenamed"))
        .where(s.id.EQC(c.id))
        .where(c2.id.EQC(s.id))
        .as("joinSub")

    const query = db
        .select()
        .from(c)
        .join(c2, c2.id, c.id)
        .leftJoin(joinSub, joinSub.id, c.id)
        .columns(
            db.uses(c).select().from(s).columns(s.id).where(s.id.EQC(c.id)).asColumn("subColumn"),
            c.name,
            c.id,
            c.id.as("renamedId"),
            SQL.NULL<string>().as("emptyValue"),
            SQL.DATE(c.created).as("myDate"),
            SQL.DATE(joinSub.created).as("myDate2"),
            SQL.IF(c.id.EQ(10 as tUserId), c.id, c2.id).as("userIdFromIf"),
            joinSub.id.as("subId")
        )
        .whereEq(c.id, input.userId) // c.id = 10
        .where(c.id.EQ(input.userId)) // c.id = 10
        .whereEq(c.name, null) // c.id IS NULL

    //SQL.union( select1, select2) // vaata, et select1 ja select2 väljad oleks samad
    //SQL.unionAll( select1, select2) // vaata, et select1 ja select2 väljad oleks samad

    console.log(query.toString())

    const res: Result = await query.execOne();
    console.log(
        res.subColumn, // type tUserId
        res.id,  // type tUserId
        res.name,  // type string
        res.renamedId,  // type tUserId
        res.myDate, // type vDateTime
        res.subId,  // type tUserId
        res.emptyValue,
        res.userIdFromIf
    )

});
