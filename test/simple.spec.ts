import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {SQL} from "../src";

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
        .join(c2, c2.id, c.id)
        .distinct()
        .columns(
            db.uses(c).select().from(s).columns(s.id).where(s.id.eq(c.id)).limit(10).asScalar("subColumn"),
            c.username,
            c.id,
            c.id.as("renamedId"),
            SQL.null<string>().as("emptyValue"),
            SQL.date(c.created).as("myDate"),
            c.created.asDate(),
            SQL.literal(MyEnum.aa).as("enumValue"),
            SQL.literal(10).as("literal"),
            SQL.if(
                c.id.is(10 as tUserId),
                c.id,
                c2.id
            ).as("userIdFromIf"),
            SQL.or(
                c.username.isNull(),
                c.username.notNull(),
                c.username.isNull()
            ).as("or"),
            SQL.and(
                c.username.isNull(),
                c.username.notNull(),
                c2.username.isNull()
            ).as("and")
        )
        .where(SQL.and(
            c.id.is(input.userId),
            c.username.isNull(),
            val && c.username.isNull(),
            c.username.notNull()
        ))
        .groupBy("renamedId", c.id)
        .orderBy("renamedId", c.id)
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
