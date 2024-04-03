import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {SQL} from "../src";

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
                c.username.ISNOTNULL(),
                c.username.ISNULL()
            ).as("or"),
            SQL.AND(
                c.username.ISNULL(),
                c.username.ISNOTNULL(),
                c2.username.ISNULL()
            ).as("and")
        )
        .where(SQL.AND(
            c.id.EQ(input.userId),
            c.username.ISNULL(),
            val && c.username.ISNULL(),
            c.username.ISNOTNULL()
        ))
        .groupBy("renamedId", c.id)
        .orderBy("renamedId", c.id)
        .noLimit()

    console.log(query.toString())
    expect(query.toString()).toEqual('SELECT \n' +
        '  (\n' +
        '    SELECT DISTINCT \n' +
        '      `s`.`id` as `id`\n' +
        '    FROM `user` as `s`\n' +
        '    WHERE `s`.`id` = `c`.`id`\n' +
        '  ) as `subColumn`,\n' +
        '  `c`.`username` as `username`,\n' +
        '  `c`.`id` as `id`,\n' +
        '  `c`.`id` as `renamedId`,\n' +
        '  NULL as `emptyValue`,\n' +
        '  DATE(`c`.`created`) as `myDate`,\n' +
        '  IF(`c`.`id` = 10,`c`.`id`,`c2`.`id`) as `userIdFromIf`,\n' +
        '  (`c`.`username` IS NULL OR `c`.`username` IS NOT NULL OR `c`.`username` IS NULL) as `or`,\n' +
        '  (`c`.`username` IS NULL AND `c`.`username` IS NOT NULL AND `c2`.`username` IS NULL) as `and`\n' +
        'FROM `user` as `c`\n' +
        'JOIN `user` as `c2` ON (`c2`.`id` = `c`.`id`)\n' +
        'WHERE (`c`.`id` = 10 AND `c`.`username` IS NULL AND `c`.`username` IS NOT NULL)\n')

    const res = await query.execOne();
    console.log(
        res.subColumn, // type tUserId
        res.id,  // type tUserId
        res.username,  // type string
        res.renamedId,  // type tUserId
        res.myDate, // type vDateTime
        res.emptyValue,
        res.userIdFromIf,
        res.or,
        res.and
    )

});
