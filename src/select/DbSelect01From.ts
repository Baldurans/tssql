import {DbSelectJoin} from "./DbSelect02Joins";
import {DbSelect} from "./DbSelect";
import {AliasedTable, isAliasAlreadyUsed, NotUsingWithPart} from "../Types";

export class DbSelect01From<Aliases, AliasesFromWith, Tables extends string, CTX> extends DbSelect<CTX> {

    public from<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`
    >(
        table: isAliasAlreadyUsed<Aliases | AliasesFromWith, Alias, AliasedTable<Alias, TableRef, any, NotUsingWithPart>>
    ): DbSelectJoin<Aliases | Alias, AliasesFromWith, Tables | TableRef, CTX> {
        this.builder.from(table as any);
        return new DbSelectJoin(this.builder);
    }

    public forUpdate(): this {
        this.builder.forUpdate()
        return this;
    }

}
