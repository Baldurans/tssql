import {DbSelectJoin} from "./DbSelect02Joins";
import {DbSelect} from "./DbSelect";
import {AliasedTable, isAliasAlreadyUsed, Key, NotUsingWithPart} from "../Types";

export class DbSelect01From<Aliases, AliasesFromWith, Tables, CTX> extends DbSelect<CTX> {

    public from<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`
    >(
        table: isAliasAlreadyUsed<Aliases | AliasesFromWith, Alias, AliasedTable<Alias, TableRef, any, NotUsingWithPart>>
    ): DbSelectJoin<Aliases | Alias, AliasesFromWith, Tables & Key<TableRef>, CTX> {
        this.builder.from(table as any);
        return new DbSelectJoin(this.builder);
    }

    public forUpdate(): this {
        this.builder.forUpdate()
        return this;
    }

}
