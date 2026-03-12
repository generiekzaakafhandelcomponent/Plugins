export interface ProcessInstanceStartResponse {
    id: string;
    definitionId: string;
    businessKey: string;
    caseInstanceId: string;
    ended: boolean;
    suspended: boolean;
    tenantId: string;
    definitionKey: string;
}
