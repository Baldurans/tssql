export type tCompanyId = number & { tCompanyId: true };

export interface Company {
    id: tCompanyId;
    name: string;
}
