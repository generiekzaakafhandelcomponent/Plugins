export interface Klantcontact {
  id?: string;
  number?: string;
  referenceId?: string;
  channel: string;
  subject: string;
  content?: string;
  reaction?: string;
  outcome: ContactOutcome;
  preferredLanguage: string;
  isConfidential: boolean;
  occurredAt?: Date;
}

export enum ContactOutcome {
  SUCCESS = "success",
  FAILURE = "failure",
  NOT_APPLICABLE = "notApplicable",
  UNKNOWN = "unknown",
}

export interface KlantcontactDTO {
  nummer?: string;
  referentienummer?: string;
  kanaal: string;
  onderwerp: string;
  inhoud?: string;
  reactie?: string;
  indicatieContactGelukt?: string | null; // Although the API docs type this as a boolean, in practice, the API returns a string, e.g. 'true'
  taal: string;
  vertrouwelijk: boolean;
  plaatsgevondenOp?: string;
}

export function mapDtoToModel(dto: KlantcontactDTO): Klantcontact {
  return {
    id: dto.referentienummer
      ? dto.referentienummer
      : dto.nummer,
    number: dto.nummer,
    referenceId: dto.referentienummer,
    channel: dto.kanaal,
    subject: dto.onderwerp,
    content: dto.inhoud,
    reaction: dto.reactie,
    outcome: parseWasSuccessfulToContactOutcome(dto.indicatieContactGelukt),
    preferredLanguage: dto.taal,
    isConfidential: dto.vertrouwelijk,
    occurredAt: dto.plaatsgevondenOp
      ? new Date(dto.plaatsgevondenOp)
      : undefined,
  };
}

export function mapModelToDto(model: Klantcontact): KlantcontactDTO {
  return {
    nummer: model.number,
    referentienummer: model.referenceId,
    kanaal: model.channel,
    onderwerp: model.subject,
    inhoud: model.content,
    reactie: model.reaction,
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
