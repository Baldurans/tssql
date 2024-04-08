import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {AND, CONCAT, DATE, GROUP_CONCAT, IF, MATH, OR, VALUE} from "../src";

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
            c.id.as("from"),
            c.id.as("renamedId"),
            VALUE(null as string).as("emptyValue"),
            DATE(c.created).as("myDate"),
            DATE(c.created),
            VALUE(MyEnum.aa).as("enumValue"),
            VALUE(10).as("literal"),
            CONCAT(c.username, "X").as("concated1"),
            GROUP_CONCAT([CONCAT(c.username, "X")], f => f.orderBy(c.username)).as("concated2"),
            MATH("(? * 100 / (? - ?))", [c.id, c.id, c.id]).as("math"),
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
