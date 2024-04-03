import {DbSelectJoin} from "./DbSelect02Joins";
import {DbSelect} from "./DbSelect";
import {AliasedTable, NOT_REFERENCED, R} from "../Types";

export class DbSelect01From<UsedAliases, WithAliases, Tables, UsedTables> extends DbSelect {

    public from<
        Alias extends string,
        TableName extends string,
        TableRef extends `${TableName} as ${Alias}`,
        Columns
    >(
        table: AliasedTable<Alias, TableRef, Columns, NOT_REFERENCED>
    ): DbSelectJoin<UsedAliases & R<Alias>, WithAliases, Tables & R<TableRef>, UsedTables> {
        this.builder.from(table);
        return new DbSelectJoin(this.builder);
    }

    public forUpdate(): this {
        this.builder.forUpdate()
        return this;
    }

}
