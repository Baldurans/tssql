import {SelectBuilder} from "./SelectBuilder";

export abstract class SelectQueryPart {

    protected readonly builder: SelectBuilder;

    constructor(builder: SelectBuilder) {
        this.builder = builder;
    }

}
