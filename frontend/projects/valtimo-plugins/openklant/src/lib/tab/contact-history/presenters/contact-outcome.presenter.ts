import { ContactOutcome } from "../models/klantcontact.model";

export function getOutcomeTranslationKey(outcome: ContactOutcome): string {
    switch (outcome) {
        case ContactOutcome.SUCCESS:
            return 'openKlant.contactHistory.outcome.success';
        case ContactOutcome.FAILURE:
            return 'openKlant.contactHistory.outcome.failure';
        case ContactOutcome.NOT_APPLICABLE:
            return 'openKlant.contactHistory.outcome.notApplicable';
        case ContactOutcome.UNKNOWN:
        default:
            return 'openKlant.contactHistory.outcome.unknown';
    }
}
