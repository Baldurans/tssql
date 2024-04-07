import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {Sql} from "../src";

enum MyEnum {
    aa = "aa",
    bb = "bb",
    dd = 123
}

test("simple", async () => {

    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const c = db.tables.user("c")
    const c2 = db.tables.user("c2")
    const s = db.tables.user("s")

    const val: any = undefined;
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

            GROUP_CONCAT(DISTINCT, [c.id, c.id], ORDER_BY, [c.id, "asc"], SEPARATOR, ",").as("sdaf"),

            GROUP_CONCAT(DISTINCT, [c.id, c.id],  [c.id, "asc"], ",").as("sdaf"),
            GROUP_CONCAT( [c.id, c.id],  [c.id, "asc"], ",").as("sdaf"),

            // with builder
            Sql.groupConcat(f => f.distinct(c.id).orderBy().separator(",")).as("aaaaa"),
            Sql.groupConcat(f => f.all(c.id).orderBy().separator(",")).as("aaaaa"),
            Sql.groupConcat(f => f.all(c.id).separator(",")).as("aaaaa"),
            Sql.groupConcat(f => f.all(c.id)).as("aaaaa"),

            // weird
            Sql.groupConcat(c.id, ",").as("aaaaa"),

            // methods
            Sql.groupConcat([c.id], [c.id], ",", true).as("aaaaa"), // last 3 optional
            Sql.groupConcat([c.id], [c.id], ",", "DISTINCT").as("aaaaa"), // last 3 optional

            // using strings (not sure if practical)
            Sql.groupConcat("DISTINCT", [c.id], "ORDER BY", [c.id], "SEPARATOR", ",").as("aaaaa"),
            Sql.groupConcat([c.id], "ORDER BY", [c.id], "SEPARATOR", ",").as("aaaaa"),
            Sql.groupConcat([c.id], "SEPARATOR", ",").as("aaaaa"),

        )
        .where(Sql.and(
            c.id.eq(input.userId),
            c.username.isNull(),
            val && c.username.isNull(),
            c.username.notNull()
        ))

        .groupBy(c.id)
        .orderBy(c.id)
        .noLimit()

    console.log(query.toString())

    const res = await query.execOne(undefined);
    console.log(
        res.subColumn, // type tUserId
        res.id,  // type tUserId
        res.username,  // type string
        res.renamedId,  // type tUserId
        res.myDate, // type vDateTime
        res.created, // type vDate
        res.emptyValue, // type string
        res.userIdFromIf, // type tUserId
        res.or, // type SQL_BOOL
        res.and, // type SQL_BOOL
        res.literal, // type 10
        res.enumValue // type MyEnum
    )

});
