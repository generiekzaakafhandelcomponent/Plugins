import { ProcessInstance } from "@valtimo/process";
import { ProcessInstanceStartResponse } from "./process-instance.model";
import { KlantcontactDTO } from "./customer-contact.model";

export const mockKlantcontactDTO: KlantcontactDTO = {
  nummer: "CC-2024-0001",
  kanaal: "EMAIL",
  onderwerp: "Vraag over factuur",
  inhoud: "Ik heb een vraag over mijn laatste factuur.",
  indicatieContactGelukt: "true",
  taal: "nl",
  vertrouwelijk: false,
  plaatsgevondenOp: "2024-11-30T09:15:00.000Z",
};
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

export const mockProcessInstanceStartResponse: ProcessInstanceStartResponse = {
  id: "mock-process-instance-start-response-id",
  definitionId: "def-1",
  businessKey: "mock-business-key-2",
  caseInstanceId: "case-instance-id-2",
  ended: false,
  suspended: false,
  tenantId: "tenant-id-2",
  definitionKey: "contactgeschiedenis-ophalen",
};
