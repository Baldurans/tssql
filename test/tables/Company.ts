export type tCompanyId = number & { tCompanyId: true };

export interface Company {
    id: tCompanyId;
    name: string;
}

export interface CompanyForEdit {
    name: unknown;
}
