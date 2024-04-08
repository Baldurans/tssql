import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {FIRST_VALUE, LAG, LAST_VALUE, LEAD, NTH_VALUE, RANK, ROW_NUMBER} from "../src";
import {SQL} from "../src/select/SQL";
import {execOne} from "./tables/exec";

test("window", async () => {

    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = db.tables.user("c")
    const c2 = db.tables.user("c2")
    const s = db.tables.user("s")
    String(c2);
    String(s)

    const query = SQL
        .select()
        .from(c)
        .window("w1", r => r.partitionBy(c.id).orderBy(c.id, "asc"))
        .columns(
            c.id,
            ROW_NUMBER().over("w1", f => f.orderBy(c.id)).as("rowNum"),
            RANK().over("w1", f => f.orderBy(c.id)).as("col1"),
            //Sql.rank().over("w2").as("col2"),
            RANK().over(f => f.partitionBy(c.username).orderBy(c.username)).as("col3"),
            FIRST_VALUE(c.id).over("w1", f => f.orderBy(c.id)).as("first"),
            LAST_VALUE(c.id).over("w1", f => f.orderBy(c.id)).as("last"),
            NTH_VALUE(c.id, 2).over("w1", f => f.orderBy(c.id)).as("nth5"),
            LAG(c.id, 2).over("w1", f => f.orderBy(c.id)).as("lag"),
            LEAD(c.id, 2).over("w1", f => f.orderBy(c.id)).as("lead")
        )
        .where(
            c.id.eq(input.userId),
        )
        .noLimit()


    console.log(query.toString())

    const res = await execOne(query);
    console.log(
        res.id,  // type tUserId
    )

});
