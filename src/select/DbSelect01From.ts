import {DbSelectJoin} from "./DbSelect02Joins";
import {DbSelect} from "./DbSelect";
import {AliasedTable, isAliasAlreadyUsed, Key, NOT_REFERENCED} from "../Types";

export class DbSelect01From<Aliases, AliasesFromWith, Tables, CTX> extends DbSelect<CTX> {

    public from<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`
    >(
        table: isAliasAlreadyUsed<Aliases & AliasesFromWith, Alias, AliasedTable<Alias, TableRef, any, NOT_REFERENCED>>
    ): DbSelectJoin<Aliases & Key<Alias>, AliasesFromWith, Tables & Key<TableRef>, CTX> {
        this.builder.from(table as any);
        return new DbSelectJoin(this.builder);
    }

    public from_noCheck<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`
    >(
        table: AliasedTable<Alias, TableRef, any, NOT_REFERENCED>
    ): DbSelectJoin<Aliases & Key<Alias>, AliasesFromWith, Tables & Key<TableRef>, CTX> {
        this.builder.from(table as any);
        return new DbSelectJoin(this.builder);
    }

    public forUpdate(): this {
        this.builder.forUpdate()
        return this;
    }

}
