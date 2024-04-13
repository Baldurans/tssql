import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {VALUE} from "../src";
import {SQL} from "../src/SQL";
import {execOne} from "./tables/exec";

interface Ctx {
    name: string;
}

test("short", async () => {
    const input: { userId: tUserId } = {userId: 10 as tUserId}

    const executor = <Result>(sql: string, ctx: Ctx): Promise<Result> => {
        return [{}] as any;
    }

    const val: "username2" = undefined;

    const query = SQL
        .selectFrom(MyDb.user)
        .join(MyDb.company, MyDb.company.id.eq(MyDb.user.companyId))
        .distinct()
        .columns(
            MyDb.user.username.as("username2"),
            VALUE(10).as("sdfaf")
        )
        .where(MyDb.user.id.eq(input.userId))
        .groupByF(r => [
            r.username2,
            MyDb.user.username,
        ])
        .havingF(r => [
            r.username2.eq("asdf"),
            MyDb.user.username.eq("adsf"),
        ])
        .orderByF(r => {
            return [
                r[val], "asc",
                MyDb.user.username,
            ]
        })
        .noLimit()

    const res2 = await query.execOne(executor, {name: "ha"})
    console.log(
        res2.username2
    )

    console.log(query.toString())
    const res = await execOne(query)

    console.log(
        res.username2
    )

});

