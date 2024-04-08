import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {AND, DATE, IF, OR, VALUE} from "../src";
import {SQL} from "../src/select/SQL";

test("simple", async () => {

    async function createQuery() {
        const db = new MyDb();
        const input: { userId: tUserId } = {userId: 10 as tUserId}

        const c = db.tables.user("c")
        const c2 = db.tables.user("c2")
        const s = db.tables.user("s")

        const query = SQL
            .select()
            .forUpdate()
            .from(c)
            .join(c2, c2.id.eq(c.id))
            .distinct()
            .columns(
                SQL.uses(c).select().from(s).columns(s.id).where(s.id.eq(c.id)).limit(10).asScalar("subColumn"),
                c.username,
                c.id,
                c.id.as("renamedId"),
                VALUE(null as string).as("emptyValue"),
                DATE(c.created).as("myDate"),
                IF(
                    c.id.eq(10 as tUserId),
                    c.id,
                    c2.id
                ).as("userIdFromIf"),
                OR(
                    c.username.isNull(),
                    c.username.notNull(),
                    c.username.isNull()
                ).as("or"),
                AND(
                    c.username.isNull(),
                    c.username.notNull(),
                    c2.username.isNull()
                ).as("and")
            )
            .where(AND(
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
