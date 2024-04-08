import {SelectBuilder} from "./SelectBuilder";

export abstract class SelectQueryPart<CTX> {

    protected readonly builder: SelectBuilder<CTX>;

    constructor(builder: SelectBuilder<CTX>) {
        this.builder = builder;
    }

}
