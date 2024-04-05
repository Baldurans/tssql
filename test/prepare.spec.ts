import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {tCompanyId} from "./tables/Company";
import {Sql} from "../src";


interface Arguments {
    id: tUserId;
    companyId: tCompanyId;
    search: string
    age: number
}

test("prepare", async () => {
    const db = new MyDb();


    // lazy prepare, prepares actually after first call.
    const preparedQuery = db.prepare((args: Arguments) => {
        const c = db.tables.user("c")

        const cond = c.age.is(args.age)

        const sub = db
            .select()
            .from(c)
            .columns(c.id, c.username)
            .where(Sql.or(
                c.username.like(args.search),
                c.created.like(args.search)
            ))
            .noLimit()
            .as("sub")

        return db
            .select()
            .forUpdate()
            .from(c)
            .join(sub, sub.id.eq(c.id))
            .columns(
                c.id,
                c.username,
            )
            .where(
                c.id.is(args.id),
                cond
            )
            .noLimit()
    })

    const oftenCalled = async () => {
        const res = await preparedQuery.execOne(undefined, {
            id: 10 as tUserId,
            companyId: 12 as tCompanyId,
            search: "aa",
            age: 1000
        })
        console.log(
            res.id,
            res.username
        )
    }

    await oftenCalled(); // prepares
    await oftenCalled(); // uses prepared
    await oftenCalled(); // uses prepared

});
