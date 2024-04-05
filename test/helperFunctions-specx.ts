import {tUserId, User} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {AliasedTable} from "../src";
import {tCompanyId} from "./tables/Company";

test("short", async () => {
    const db = new MyDb();
    const input: { userId: tUserId } = {userId: 10 as tUserId}
    const c = db.tables.user("c")

    const func = <Alias extends string>(table: AliasedTable<Alias, `user as ${Alias}`, User, any>) => {
        const o = db.tables.company("o");
        return db
            .uses(table)
            .select()
            .from(o)
            .columns(o.id)
            .where(
                table.id.is(10 as tUserId),
                o.id.is(10 as tCompanyId)
            )
            .noLimit()
            .as("sub")
    }

    const func2 = <Alias extends string>(table: Table<Alias, "user", User>) => {
        const o = db.tables.company("o");
        return db
            .uses(table)
            .select()
            .from(o)
            .columns(table.id)
            .where(
                table.id.is(10 as tUserId),
                o.id.is(10 as tCompanyId)
            )
            .noLimit()
            .as("sub2")
    }

    const sub = func(c);
    const sub2 = func2(c);
    const res = await db
        .select()
        .forUpdate()
        .from(c)
        .join(sub, sub.id.is(10 as tCompanyId))
        .join(sub2, sub2.id.eq(c.id))
        .distinct()
        .columns(
            c.username,
            sub.id.as("subId"),
            sub2.id.as("sub2Id")
        )
        .where(c.id.is(input.userId))
        .execOne(undefined);

    console.log(
        res.username,
        res.subId,
        res.sub2Id
    )

});

type Table<Alias extends string, TableName extends string, Entity> = AliasedTable<Alias, `${TableName} as ${Alias}`, Entity, any>
