import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {tCompanyId} from "./tables/Company";


interface Arguments {
    id: tUserId;
    companyId: tCompanyId;
}

test("prepare", async () => {
    const db = new MyDb();

    // lazy prepare, prepares actually after first call.
    const preparedQuery = (db as any).prepare((args: Arguments) => {
        const c = db.tables.user("c")
        return db
            .select()
            .forUpdate()
            .from(c)
            .distinct()
            .columns(
                c.id,
                c.username,
            )
            .where(c.id.is(args.id))
            .noLimit()
    })

    const oftenCalled = async () => {
        const res = await preparedQuery.exec({
            id: 10 as tUserId,
            companyId: 12 as tCompanyId
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
