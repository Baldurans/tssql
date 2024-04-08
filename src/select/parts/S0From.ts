import {S1Join} from "./S1Join";
import {SelectQueryPart} from "../SelectQueryPart";
import {AliasedTable, isAliasAlreadyUsed, Key, NotUsingWithPart} from "../../Types";

export class S0From<Aliases, AliasesFromWith, Tables> extends SelectQueryPart {

    public from<
        Alias extends string,
        TableRef extends `${string} as ${Alias}`
    >(
        table: isAliasAlreadyUsed<Aliases & AliasesFromWith, Alias, AliasedTable<Alias, TableRef, object, string | NotUsingWithPart>>
    ): S1Join<Aliases & Key<Alias>, AliasesFromWith, Tables & Key<TableRef>> {
        this.builder.from(table as any);
        return new S1Join(this.builder);
    }

    public forUpdate(): this {
        this.builder.forUpdate()
        return this;
    }

}
