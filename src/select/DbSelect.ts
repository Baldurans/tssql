import {DbSelectBuilder} from "./DbSelectBuilder";

export abstract class DbSelect {

    protected readonly parts: DbSelectBuilder;

    constructor(parts: DbSelectBuilder) {
        this.parts = parts;
    }

}
