export interface CustomerContact {
  id?: string;
  channel: string;
  subject: string;
  content?: string;
  outcome: ContactOutcome;
  preferredLanguage: string;
  isConfidential: boolean;
  occurredAt?: Date;
}

export enum ContactOutcome {
  SUCCESS = "success",
  FAILURE = "failure",
  NOT_APPLICABLE = "not_applicable",
  UNKNOWN = "unknown",
}

export interface CustomerContactDTO {
  nummer?: string;
  kanaal: string;
  onderwerp: string;
  inhoud?: string;
  indicatieContactGelukt?: string | null; // Although the API docs type this as a boolean, in practice, the API returns a string, e.g. 'true'
  taal: string;
  vertrouwelijk: boolean;
  plaatsgevondenOp?: string;
}

export function mapDtoToModel(dto: CustomerContactDTO): CustomerContact {
  return {
    id: dto.nummer,
    channel: dto.kanaal,
    subject: dto.onderwerp,
    content: dto.inhoud,
    outcome: parseWasSuccessfulToContactOutcome(dto.indicatieContactGelukt),
    preferredLanguage: dto.taal,
    isConfidential: dto.vertrouwelijk,
    occurredAt: dto.plaatsgevondenOp
      ? new Date(dto.plaatsgevondenOp)
      : undefined,
  };
}

export function mapModelToDto(model: CustomerContact): CustomerContactDTO {
  return {
    nummer: model.id,
    kanaal: model.channel,
    onderwerp: model.subject,
    inhoud: model.content,
    indicatieContactGelukt: parseContactOutcomeToBoolean(model.outcome),
    taal: model.preferredLanguage,
    vertrouwelijk: model.isConfidential,
    plaatsgevondenOp: model.occurredAt
      ? model.occurredAt.toISOString()
      : undefined,
  };
}

function parseWasSuccessfulToContactOutcome(
  wasSuccessful?: string | null
): ContactOutcome {
  switch (wasSuccessful) {
    case null:
      return ContactOutcome.NOT_APPLICABLE;
    case "true":
      return ContactOutcome.SUCCESS;
    case "false":
      return ContactOutcome.FAILURE;
    default:
      return ContactOutcome.UNKNOWN;
  }
}

function parseContactOutcomeToBoolean(
  outcome: ContactOutcome
): string | null | undefined {
  switch (outcome) {
    case ContactOutcome.SUCCESS:
      return "true";
    case ContactOutcome.FAILURE:
      return "false";
    case ContactOutcome.NOT_APPLICABLE:
      return null;
    case ContactOutcome.UNKNOWN:
      return undefined;
  }
}
