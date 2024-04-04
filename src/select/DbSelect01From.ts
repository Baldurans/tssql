import {DbSelectJoin} from "./DbSelect02Joins";
import {DbSelect} from "./DbSelect";
import {AliasedTable, CheckIfAliasIsAlreadyUsed, NOT_REFERENCED, TrueRecord} from "../Types";

export class DbSelect01From<Aliases, AliasesFromWith, Tables, CTX> extends DbSelect<CTX> {

    public from<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: CheckIfAliasIsAlreadyUsed<Aliases & AliasesFromWith, Alias, AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>>
    ): DbSelectJoin<Aliases & TrueRecord<Alias>, AliasesFromWith, Tables & TrueRecord<TableRef>, CTX> {
        this.builder.from(table as any);
        return new DbSelectJoin(this.builder);
    }

    public forUpdate(): this {
        this.builder.forUpdate()
        return this;
    }

}
