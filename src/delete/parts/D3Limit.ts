import {ExecDeleteMethods, getExecDeleteMethods} from "./D4Exec";
import {DeleteBuilder} from "../DeleteBuilder";

export function getDeleteLimitMethods(builder: DeleteBuilder): DeleteLimitMethods {
    return {
        noLimit: () => {
            return getExecDeleteMethods(builder)
        },
        limit: (limit: number | [number, number]): ExecDeleteMethods => {
            builder.limit(limit);
            return getExecDeleteMethods(builder);
        },
        limit1: () => {
            builder.limit(1);
            return getExecDeleteMethods(builder);
        }
    }
}

export interface DeleteLimitMethods {
    noLimit(): ExecDeleteMethods

    limit(limit: number | [number, number]): ExecDeleteMethods

    limit1(): ExecDeleteMethods
}
