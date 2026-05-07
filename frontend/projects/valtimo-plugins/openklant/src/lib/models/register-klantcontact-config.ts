export interface RegisterKlantcontactConfig {
    referentienummer: string | undefined;
    kanaal: string;
    onderwerp: string;
    inhoud: string | undefined;
    reactie: string | undefined;
    indicatieContactGelukt: string | undefined;
    vertrouwelijk: string;
    taal: string;
    plaatsgevondenOp: string;
    metadata: string;
    hasBetrokkene: boolean;
    partijUuid: string | undefined;
    voorletters: string | undefined;
    voornaam: string | undefined;
    voorvoegselAchternaam: string | undefined;
    achternaam: string | undefined;
}
