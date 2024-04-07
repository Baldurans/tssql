import {tUserId} from "./tables/User";
import {MyDb} from "./tables/MyDb";
import {Sql} from "../src";

test("window2", async () => {

    const db = new MyDb();
    const c = db.tables.user("c")
    const c2 = db.tables.user("c2")
    const s = db.tables.user("s")
    String(c2);
    String(s)
    /*

    const query = `WITH sorted_by_latest AS (SELECT *,
                                                        RANK() OVER (PARTITION BY tin ORDER BY updated_at DESC) AS latest
                                                 FROM ${TableNames.validationRequestTable}
                                                 WHERE type = ${this.db.escape(type)}
                                                   AND local_id IN (${this.db.escape(ids)}))
                       SELECT *,
                              BIN_TO_UUID(uuid)          AS uuid,
                              UNIX_TIMESTAMP(created_at) as created_at,
                              UNIX_TIMESTAMP(updated_at) as updated_at
                       FROM sorted_by_latest
                       WHERE latest = 1
                       ORDER BY created_at DESC`;



      WITH `sorted_by_latest` AS (SELECT
          `c`.`id` as `id`,
          `c`.`created_at` as `created_at`,
          `c`.`updated_at` as `updated_at`,
          RANK() OVER (PARTITION BY `c`.`age` ORDER BY `c`.`created` desc) as `latest`
        FROM `user` as `c`
        WHERE `c`.`username` = 'asd'
       AND `c`.`age` IN( 1, 2, 3, 4)
    )

    SELECT
      `tbl`.`id` as `id`,
      BIN_TO_UINT(`tbl`.`id`) as `uuid`,
      UNIX_TIMESTAMP(`tbl`.`created_at`) as `created_at`,
      UNIX_TIMESTAMP(`tbl`.`updated_at`) as `updated_at`
    FROM `sorted_by_latest` as `tbl`
    WHERE `tbl`.`latest` = 1
    ORDER BY `tbl`.`created_at` desc

     */

    const sub = db.select()
        .from(c)
        .columns(
            c.id,
            c.created_at,
            c.updated_at,
            Sql.RANK().over(f => f.partitionBy(c.age).orderBy(c.created, "desc")).as("latest")
        )
        .where(
            c.username.eq("asd"), // type = ${this.db.escape(type)}
            c.age.in([1, 2, 3, 4] as tUserId[]) // local_id IN (${this.db.escape(ids)}))
        )
        .noLimit()
        .as("sorted_by_latest")
    const ref = MyDb.createRef(sub, "tbl")

    const query = db
        .with(sub)
        .select()
        .from(ref)
        .columns(
            ref.id,
            Sql.BIN_TO_UUID(ref.id).as("uuid"),
            ref.created_at.asUnixTimestamp(),
            ref.updated_at.asUnixTimestamp()
        )
        .where(ref.latest.eq(1))
        .orderBy(ref.created_at, "desc")
        .noLimit()


    console.log(query.toString())

    const res = await query.execOne(undefined);
    console.log(
        res.id,  // type tUserId
    )

});
