import {DbSelectBuilder} from "./DbSelectBuilder";

export abstract class DbSelect {

    protected readonly builder: DbSelectBuilder;

    constructor(builder: DbSelectBuilder) {
        this.builder = builder;
    }

}
