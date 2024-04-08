import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {SQL} from "../src/SQL";
import {execOne} from "./tables/exec";

test("with", async () => {

    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = MyDb.user.as("c")

    const q1 = SQL.select().from(c).columns(c.username, c.id).where(c.id.eq(input.userId)).noLimit()
    const q2 = SQL.select().from(c).columns(c.username, c.id,).where(c.id.eq(input.userId)).noLimit()
    const q3 = SQL.select().from(c).columns(c.username, c.id).where(c.id.eq(input.userId)).noLimit()

    const union = SQL
        .union(q1)
        .all(q2)
        .all(q3)
        .groupByF(r => [r.username])
        .orderByF(r => [r.id])
        .limit(10)
        .as("x")

    const b = SQL.select()
        .from(union)
        .columns(union.id, union.username)
        .where(union.id.eq(10 as tUserId))
        .noLimit()

    console.log(b.toString())

    const res = await execOne(b);
    console.log(
        res.id,  // type tUserId
    )

});
