import {tUserId} from "./tables/User";
import {vDate} from "../src/CustomTypes";
import {SQL} from "../src/SQL";
import {MyDb} from "./tables/MyDb";
import {SQL_BOOL} from "../src";

test("complex", async () => {

    const db = new MyDb();

    const c = db.tables.user("c")
    const cFake = db.tables.company("c")
    const c2 = db.tables.user("c2")
    const c3 = db.tables.user("c3")
    const c4 = db.tables.user("c4")
    const c5 = db.tables.user("c5")

    const s = db.tables.user("s")


    // NOTICE: It is very hard to mess up field names, as it most certainly means some hacking as you always reference fields from table objects.

    const withSub = db
        .select()
        .from(s)
        .columns(s.id, s.created, s.name, s.age)
        .columns(s.id.as("subIdRenamed"))
        .where(s.id.EQ(10 as tUserId))
        .as("withSub")
    const withSubSub1 = MyDb.createRef(withSub, "withSubSub1");
    const withSubSub2 = MyDb.createRef(withSub, "withSubSub2");

    const withSub2 = db
        .select()
        .from(s)
        .columns(s.id, s.created, s.name, s.age)
        .columns(s.id.as("subIdRenamed"))
        .where(s.id.EQ(10 as tUserId))
        .as("withSub2")
    const withSub2Sub1 = MyDb.createRef(withSub2, "withSub2Sub1")
    String(withSub2Sub1)

    const subQueryTable = db
        .uses(c)
        .select()
        .from(s)
        .columns(s.id, s.name)
        //.columns(s.name.as("id")) // ____ERROR: id already used
        .columns(s.id.as("subIdRenamed"))
        .where(SQL.EQC(s.id, c.id))
        .as("sub")

    const expr = SQL.EXPRESSION("IF(", c.name, " > ", c2.name, ",", c.id, ",", c2.id, ")").cast<tUserId>();

    const query = db
        .with(withSub)
        .select()
        .from(c)
        .join(c2, c2.id, c.id)

        // .from(cFake) // ____ERROR, alias c is already used!
        // .join(c2, c2.id, c.id) // ____ERROR, c2 already joined
        // .join(c4, c.id, c.id) // ____ERROR, invalid join condition (second argument must be from c4)
        // .join(c5, c5.id, c.name) // ____ERROR, c5.id type != c2.name type

        .join(subQueryTable, subQueryTable.subIdRenamed, c.id)
        //.join(subQueryTable, subQueryTable.subIdRenamed, c.id) // ____ERROR, alias is already used!

        //.leftJoin(withSub, withSub.id, c.id) // ____ERROR, alias is already in use.
        .leftJoin(withSubSub1, withSubSub1.id, c.id)
        .leftJoin(withSubSub2, withSubSub2.id, c.id)
        //.leftJoin(withSub2Sub1, withSub2Sub1.id, c.id) // ____ERROR, not referenced in with part.

        .columns(
            db.uses(c).select().from(s).columns(s.id).where(SQL.EQC(c.id, s.id)).asColumn("someItem"),
            c.name,
            c.id,
            subQueryTable.id.as("sId"),
            subQueryTable.subIdRenamed.as("subIdRenamedAgain"),
            c.id.as("renamedId"),
            SQL.DATE(c.created).as("myDate"),
            SQL.COMPAREC(c.id, ">", c2.id).as("expr1"),
            SQL.COMPAREC(c.id, ">", c2.id).as("expr2"),
            SQL.COMPAREC(c.id, "=", expr).as("expr3"),
            SQL.IF(c.id.EQC(c2.id), c.name, c2.name).cast<string>().as("expr4"),

            withSubSub1.subIdRenamed.as("withSubSub1"),
            withSubSub2.subIdRenamed.as("withSubSub2"),

            db.uses(c)
                .select()
                .from(s)
                .columns(s.id)
                // .columns_WITH_CTRL_CLICK_CAPABILITY_BUT_WITHOUT_DUPLICATE_CHECK(s.name) // ___ERROR - Scalar subquery allows only 1 column!
                .where(SQL.EQC(s.id, c.id)).asColumn("subColumn"),

            //c.id, // ____ERROR, can't add same field twice!
            //subQueryTable.id.as("sId"), // ____ERROR, Can't add same field twice!
            //SQL.EXPR(c.id, " > ", c3.id).as("expr2"), // ____ERROR, c3 is not referenced!
            //cFake.name, // ____ERROR, table name does not match!
            //c3.name // ____ERROR, c3 is not referenced
        )

        //.columns( c.name ) // ____ERROR, Can't add same field twice!

        .whereEq(c.id, 10 as tUserId) // c.id = 10
        .whereEq(SQL.DATE(c.created), "2024.03.09" as vDate)

        //.whereEq(SQL.DATE(c2.name), "2024.03.09" as vDate) // ____ERROR - wrong type DATE(c.name) = '2024.03.09'
        //.whereEq(c.id, 10) // ____ERROR, 10 is not tUser

        .where(SQL.EQ(c.id, 10 as tUserId)) // c.id = 10

        // .where(SQL.EQ(c.id, 10)) // ____ERROR, as 10 is not tUserId
        // .where(SQL.EQ(c3.name, "aa")) // ____ERROR, c3 is not referenced

        .where(SQL.EQC(c.id, c2.id)) // c.id = 10
        // .where(SQL.EQC(c.id, c.name)) // ____ERROR, as tUserId != string

        .where(SQL.COMPAREC(c.id, ">=", c2.id))
        //.where(SQL.COMPAREC(c.id, ">", c3.id)) // ____ERROR, c3 is not referenced. Should be error.

        .where(SQL.EXPRESSION(c.id, " > ", c2.id).cast<SQL_BOOL>())
        .where(SQL.ISNULL(c.id))

        .groupBy(c.id, c.name, "expr2")

        .orderBy(c.id, "asc", c.id, c.name, "expr2", "desc")

    console.log(query.toString())

    const res = await query.execOne()
    console.log(
        res.id, // type tUserId
        res.name,  // type string
        res.renamedId,  // type tUserId
        res.myDate, // type vDateTime
        res.sId,
        res.subIdRenamedAgain,
        res.subColumn,
        res.expr1,
        res.expr2,
        res.expr3,
        res.expr4,
        res.withSubSub1,
        res.withSubSub2,
        // res.name2,  // ____ERROR - no such field returned. (it shows white because upper query has errors, would be red otherwise.)
    )

    String(c3)
    String(c4)
    String(c5)
    String(cFake)

});
