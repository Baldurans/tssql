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
    withSubId: tUserId
    //age: string;
}

test("simple", async () => {

    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = db.tables.user("c")
    const c2 = db.tables.user("c2")
    const s = db.tables.user("s")

    // // OPTION A
    // // ISSUE: not calling .with is fine, as then sub1 is just a normal subquery. This can lead to accidentally forgetting it?
    // const sub1 = db
    //     .select()
    //     .from(c)
    //     .columns(c.id)
    //     .as("sub");
    //
    // const main1 = await db
    //     .with(sub1) // Forgetting to add this will lead to using sub1 as normal subquery, not in the "with" part.
    //     // There is no way to check that it is a mistake and might never be visible unless you inspect the SQL query.
    //     .select()
    //     .from(sub1)
    //     .leftJoin(sub1, sub1.id, c.id)
    //     .exec()
    //
    // // OPTION B
    // // GOOD: Intent is clear.
    // // BAD: Intent might be in the wrong place, sub2 shouldn't really care if it is used in with part or subquery part.
    // const sub2 = db
    //     .select()
    //     .asWith("sub");
    // const main2 = await db
    //     //.with(sub2) // This is redundant, as in the "from" call we know it is expected to be in "with" part.
    //     .select()
    //     .from(sub2)
    //     .exec()
    //
    // // OPTION C
    // // GOOD: sub query is normal (as it kind of should be), we tell where we use it in the main query.
    // // BAD: methods fromWith, joinWith, leftJoinWith and so on are stupid
    // const sub3 = db
    //     .select()
    //     .as("sub");
    // const main3 = await db
    //     .select()
    //     .fromWith(sub3)
    //     .joinWith(sub3)
    //     .exec()
    //
    // // OPTION D
    // // GOOD: sub query is normal (as it kind of should be), we tell where we use it in the main query.
    // // BAD: methods fromWith, joinWith, leftJoinWith and so on are stupid
    // const sub3 = db
    //     .select()
    //     .as("sub");
    // const main3 = await db
    //     .with(sub3)
    //     .select()
    //     .fromWith(sub3) // Checks that exists in with aliases
    //     .joinWith(sub3) // Checks that exists in with aliases
    //     .exec()


    const withSub = db
        .select()
        .from(s)
        .columns(s.id, s.created, s.name, s.age)
        .columns(s.id.as("subIdRenamed"))
        .where(s.id.EQ(10 as tUserId))
        .as("withSub")

    const withSub2 = db
        .select()
        .from(s)
        .columns(s.id, s.created, s.name, s.age)
        .columns(s.id.as("subIdRenamed"))
        .where(s.id.EQ(10 as tUserId))
        .as("withSub2")

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
        .with(withSub)
        .with(withSub2)
        .select()
        .from(c)
        .join(c2, c2.id, c.id)
        .leftJoin(joinSub, joinSub.id, c.id)
        .leftJoin(withSub, withSub.id, c.id)
        .leftJoin(withSub2, withSub2.id, c.id)
        .columns(
            db.uses(c).select().from(s).columns(s.id).where(s.id.EQC(c.id)).asColumn("subColumn"),
            c.name,
            c.id,
            c.id.as("renamedId"),
            SQL.NULL<string>().as("emptyValue"),
            SQL.DATE(c.created).as("myDate"),
            SQL.DATE(joinSub.created).as("myDate2"),
            SQL.IF(c.id.EQ(10 as tUserId), c.id, c2.id).as("userIdFromIf"),
            joinSub.id.as("subId"),
            withSub.subIdRenamed.as("withSubId"),
            withSub2.subIdRenamed.as("withSubId2")
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
