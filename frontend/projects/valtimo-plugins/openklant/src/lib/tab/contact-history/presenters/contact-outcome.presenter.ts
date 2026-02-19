import { ContactOutcome } from "../models/klantcontact.model";

export function getOutcomeTranslationKey(outcome: ContactOutcome): string {
    switch (outcome) {
        case ContactOutcome.SUCCESS:
            return 'contactHistory.outcome.success';
        case ContactOutcome.FAILURE:
            return 'contactHistory.outcome.failure';
        case ContactOutcome.NOT_APPLICABLE:
            return 'contactHistory.outcome.notApplicable';
        case ContactOutcome.UNKNOWN:
        default:
            return 'contactHistory.outcome.unknown';
    }
}
