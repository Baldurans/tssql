import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {SQL} from "../src/SQL";

test("simple", async () => {

    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = db.tables.user("c")
    const c2 = db.tables.user("c2")
    const s = db.tables.user("s")

    const query = db
        .select()
        .from(c)
        .join(c2, c2.id, c.id)
        .columns(
            db.uses(c).select().from(s).columns(s.id).where(s.id.EQC(c.id)).asColumn("subColumn"),
            c.name,
            c.id,
            c.id.as("renamedId"),
            SQL.NULL<string>().as("emptyValue"),
            SQL.DATE(c.created).as("myDate"),
            SQL.IF(c.id.EQ(10 as tUserId), c.id, c2.id).as("userIdFromIf"),
            SQL.OR(c.name.ISNULL(), c.name.ISNOTNULL(), c.name.ISNULL()).as("or"),
            SQL.AND(c.name.ISNULL(), c.name.ISNOTNULL(), c2.name.ISNULL()).as("and")
        )
        .where(SQL.AND(
            c.id.EQ(input.userId),
            c.name.ISNULL(),
            c.name.ISNOTNULL()
        )) // c.id = 10

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
        res.or,
        res.and
    )

});
