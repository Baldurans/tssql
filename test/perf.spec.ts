import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {SQL} from "../src";

test("simple", async () => {

    async function createQuery() {
        const db = new MyDb();
        const input: { userId: tUserId } = {userId: 10 as tUserId}

        const c = db.tables.user("c")
        const c2 = db.tables.user("c2")
        const s = db.tables.user("s")

        const query = db
            .select()
            .forUpdate()
            .from(c)
            .join(c2, c2.id, c.id)
            .distinct()
            .columns(
                db.uses(c).select().from(s).columns(s.id).where(s.id.EQC(c.id)).limit(10).asScalar("subColumn"),
                c.username,
                c.id,
                c.id.as("renamedId"),
                SQL.NULL<string>().as("emptyValue"),
                SQL.DATE(c.created).as("myDate"),
                SQL.IF(
                    c.id.EQ(10 as tUserId),
                    c.id,
                    c2.id
                ).as("userIdFromIf"),
                SQL.OR(
                    c.username.ISNULL(),
                    c.username.NOTNULL(),
                    c.username.ISNULL()
                ).as("or"),
                SQL.AND(
                    c.username.ISNULL(),
                    c.username.NOTNULL(),
                    c2.username.ISNULL()
                ).as("and")
            )
            .where(SQL.AND(
                c.id.EQ(input.userId),
                c.username.ISNULL(),
                c.username.ISNULL(),
                c.username.NOTNULL()
            ))
            .groupBy("renamedId", c.id)
            .orderBy("renamedId", c.id)
            .noLimit()
            .toString()
        String(query);
    }

    for (let i = 0; i < 50000; i++) {
        await createQuery();
    }

});
