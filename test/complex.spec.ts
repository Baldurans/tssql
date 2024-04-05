import {tUserId} from "./tables/User";
import {Sql} from "../src/Sql";
import {MyDb} from "./tables/MyDb";
import {vDate} from "../src";

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
        .columns(s.id, s.created, s.username, s.age, s.id.as("subIdRenamed"))
        .where(s.id.is(10 as tUserId))
        .noLimit()
        .as("withSub")
    const withSubSub1 = MyDb.createRef(withSub, "withSubSub1");
    const withSubSub2 = MyDb.createRef(withSub, "withSubSub2");

    const withSub2 = db
        .select()
        .from(s)
        .columns(s.id, s.created, s.username, s.age, s.id.as("subIdRenamed"))
        .where(s.id.is(10 as tUserId))
        .limit([0, 50])
        .as("withSub2")
    const withSub2Sub1 = MyDb.createRef(withSub2, "withSub2Sub1")
    String(withSub2Sub1)

    const subQueryTable = db
        .uses(c)
        .select()
        .from(s)
        .columns(
            s.id,
            s.username,
            s.id.as("subIdRenamed")
        )
        .where(Sql.eq(s.id, c.id))
        .noLimit()
        .as("sub")

    // const xxx1 = c.id.eq(10 as tUserId) // ____ERROR, giving value to a method that expects SqlExpression.
    // const xxx2 = Sql.is(Sql.date(c2.username), "2024.03.09" as vDate) // ____ERROR - wrong type DATE(c.name) = '2024.03.09',
    // const xxx3 = c.id.is(10) // ____ERROR, 10 is not tUser
    // const xxx4 = Sql.is(c.id, 10)  // ____ERROR, as 10 is not tUserId


    const query = db
        .with(withSub)
        .select()
        // //.from(withSub) // Alias is already used!
        .from(c)
        .join(c2, c2.id.eq(c.id))
        .join(subQueryTable, subQueryTable.subIdRenamed.eq(c.id))
        .leftJoin(withSubSub1, withSubSub1.id.eq(c.id))
        .leftJoin(withSubSub2, withSubSub2.id.eq(c.id))

        // .join(cFake, cFake.id.eq(c.id)) // ____ERROR, alias c is already used!
        // .join(c2, c2.id.eq(c.id)) // ____ERROR, c2 already joined
        // .join(c4, c.id.eq(c.id)) // ____ERROR, join condition should use arguments from joined table
        // .join(subQueryTable, subQueryTable.subIdRenamed.eq(c.id)) // ____ERROR, alias is already used!
        // .leftJoin(withSub, withSub.id.eq(c.id)) // ____ERROR, alias is already in use.
        // .leftJoin(withSub2Sub1, withSub2Sub1.id.eq(c.id)) // ____ERROR, not referenced in with part.


        .columns(
            c.id,
            subQueryTable.id.as("sId"),
            subQueryTable.subIdRenamed.as("subIdRenamedAgain"),
            c.id.as("renamedId"),
            Sql.date(c.created).as("myDate"),
            c.id.comparec("<=", c2.id).as("expr1"),
            c.id.comparec(">", c2.id).as("expr2"),
            Sql.__veryDangerousUnsafeSqlExpression({I_DID_NOT_USE_UNSAFE_VARIABLES_TO_CONSTRUCT_THIS_STRING: ["100 + ROUND(", c.id, " > ", c2.id, ")"]}).cast<number>().as("expr3"),
            Sql.if(c.id.eq(c2.id), c.username, c2.username).cast<string>().as("expr4"),
            withSubSub1.subIdRenamed.as("withSubSub1"),
            withSubSub2.subIdRenamed.as("withSubSub2"),
            db.uses(c).select().from(s).columns(s.id).where(Sql.eq(c.id, s.id)).noLimit().asScalar("someItem"),
            db.uses(c)
                .select()
                .from(s)
                .columns(
                    s.id,
                    //s.username // ___ERROR - Scalar subquery allows only 1 column!
                )
                .where(s.id.eq(c.id)).noLimit().asScalar("subColumn"),

            // c.id, // ____ERROR, can't add same field twice!
            // subQueryTable.id.as("sId"), // ____ERROR, Can't add same field twice!
            // cFake.name, // ____ERROR, table X is not used in the query
            // c3.username // ____ERROR, table X is not used in the query
            // Sql.concat(cFake.name, c2.username).as("concated"), // ____ERROR, table X is not used in the query (twice!)

        )

        .where(
            c.id.is(10 as tUserId),
            c.id.eq(c2.id),
            Sql.date(c.created).compare(">=", "2024.03.09" as vDate),
            c.id.is(10 as tUserId),
            c.id.eq(c2.id),
            c.id.comparec(">=", c2.id),

            // cFake.name.is("as"),
            // c3.username.is("aa"),  // ____ERROR, c3 is not referenced
            // Sql.is(c3.username, "aa"), // ____ERROR, c3 is not referenced
            // Sql.and(c3.username.is("a"), cFake.name.is("a"), c4.username.is("a")), // ____ERROR, c3 is not referenced

        )

        // .groupBy(c.id, c.username, "expr2")
        // .groupBy(c.username, "expr2", c3.id) // ____ERROR, c3 is not referenced
        // .groupBy(c.id, c.username, "notDefined") // ____ERROR, notDefined does not exist
        // .groupBy(c.id, Sql.field("notDefined")) // ____ERROR, notDefined does not exist
        // .groupBy(c.id, Sql.concat(Sql.field("notDefined")), c.id) // ____ERROR, notDefined does not exist
        // .groupBy(c.id, Sql.concat(Sql.field("notDefined"), c.id), c.id) // ____ERROR, notDefined does not exist

        // .having(c.id.is(10 as tUserId))  // OK
        // .having(Sql.field("withSubSub2").is("10"))  // OK
        // .having(Sql.field("withSubSub2")) // ____ERROR, expression should be of Boolean type.
        // .having(c3.id.is(10 as tUserId)) // ____ERROR, c3 is not referenced
        // .having(Sql.field("notDefined2").is("notDefined2")) // ____ERROR, notDefined does not exist

        .orderBy(c.id, "asc", c.id, c.username, "expr2", "desc")
        .noLimit()

    console.log(query.toString())

    const res = await query.execOne(undefined)
    console.log(
        res.id, // type tUserId
        res.renamedId,  // type tUserId
        res.myDate, // type vDateTime
        res.someItem, // tUserId
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
