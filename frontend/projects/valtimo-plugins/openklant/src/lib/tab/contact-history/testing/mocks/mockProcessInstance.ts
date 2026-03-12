import { ProcessInstance } from "@valtimo/process";

export const mockProcessInstance: ProcessInstance = {
    id: "mock-process-instance-id",
    businessKey: "mock-business-key-1",
    startTime: new Date().toISOString(),
    endTime: "", // still running
    processDefinitionKey: "contactgeschiedenis-ophalen",
    processDefinitionName: "Contactgeschiedenis ophalen",
    startUserId: "start-user-id-1",
    deleteReason: "",
    variables: [],
};