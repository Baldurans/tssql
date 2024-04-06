import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {Sql} from "../src";

test("window", async () => {

    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = db.tables.user("c")
    const c2 = db.tables.user("c2")
    const s = db.tables.user("s")
    String(c2);
    String(s)

    const query = db
        .select()
        .from(c)
        .window("w1", r => r.partitionBy(c.id).orderBy(c.id, "asc"))
        .columns(
            c.id,
            Sql.rowNumber().over("w1", f => f.orderBy(c.id)).as("rowNum"),
            Sql.rank().over("w1", f => f.orderBy(c.id)).as("col1"),
            //Sql.rank().over("w2").as("col2"),
            Sql.rank().over(f => f.partitionBy(c.username).orderBy(c.username)).as("col3"),
            Sql.firstValue(c.id).over("w1", f => f.orderBy(c.id)).as("first"),
            Sql.lastValue(c.id).over("w1", f => f.orderBy(c.id)).as("last"),
            Sql.nthValue(c.id, 2).over("w1", f => f.orderBy(c.id)).as("nth5"),
            Sql.lag(c.id, 2).over("w1", f => f.orderBy(c.id)).as("lag"),
            Sql.lead(c.id, 2).over("w1", f => f.orderBy(c.id)).as("lead")
        )
        .where(
            c.id.eq(input.userId),
        )
        .noLimit()


    console.log(query.toString())

    const res = await query.execOne(undefined);
    console.log(
        res.id,  // type tUserId
    )

});
