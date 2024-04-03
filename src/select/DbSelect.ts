import {DbSelectBuilder} from "./DbSelectBuilder";

export abstract class DbSelect<CTX> {

    protected readonly builder: DbSelectBuilder<CTX>;

    constructor(builder: DbSelectBuilder<CTX>) {
        this.builder = builder;
    }

}
