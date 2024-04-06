import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {Sql} from "../src";

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
            .join(c2, c2.id.eq(c.id))
            .distinct()
            .columns(
                db.uses(c).select().from(s).columns(s.id).where(s.id.eq(c.id)).limit(10).asScalar("subColumn"),
                c.username,
                c.id,
                c.id.as("renamedId"),
                Sql.null<string>().as("emptyValue"),
                Sql.date(c.created).as("myDate"),
                Sql.if(
                    c.id.eq(10 as tUserId),
                    c.id,
                    c2.id
                ).as("userIdFromIf"),
                Sql.or(
                    c.username.isNull(),
                    c.username.notNull(),
                    c.username.isNull()
                ).as("or"),
                Sql.and(
                    c.username.isNull(),
                    c.username.notNull(),
                    c2.username.isNull()
                ).as("and")
            )
            .where(Sql.and(
                c.id.eq(input.userId),
                c.username.isNull(),
                c.username.isNull(),
                c.username.notNull()
            ))
            .groupByF(r => [r.renamedId, c.id])
            .orderByF(r => [r.renamedId, c.id])
            .noLimit()
            .toString()
        String(query);
    }

    for (let i = 0; i < 50000; i++) {
        await createQuery();
    }

});
