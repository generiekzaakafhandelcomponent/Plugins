export interface RegisterKlantcontactConfig {
  kanaal: string;
  onderwerp: string;
  inhoud: string;
  vertrouwelijk: string;
  taal: string;
  plaatsgevondenOp: string;
  hasBetrokkene: boolean;
  partijUuid: string | undefined;
  voorletters: string | undefined;
  voornaam: string | undefined;
  voorvoegselAchternaam: string | undefined;
  achternaam: string | undefined;
}
