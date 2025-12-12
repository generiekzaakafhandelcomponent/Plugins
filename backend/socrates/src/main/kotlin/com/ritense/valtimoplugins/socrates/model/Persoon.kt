package com.ritense.valtimoplugins.socrates.model

import java.time.LocalDate

data class Persoon(
    val aNummer: String,
    val burgerservicenummer: String,
    val geboortedatum: LocalDate,
    val partner: Partner?,

    /**
     * 0 = Onbekend, 1 = Man, 2 = Vrouw
     */
    val geslachtsaanduiding: Int,

    /**
     * De stam van de geslachtsnaam. Deze is ontadaan van voorvoegsels en titels.
     */
    val geslachtsnaamstam: String,
    val voorlettersAanschrijving: String,
    val voornamen: String,
    val voorvoegsel: String,

    /**
     * Een aanduiding voor de wijze van aanschrijving van de NATUURLIJK PERSOON.
     *
     * 1 = EigenNaam, 2 = ExEchtgenoot, 3 = ExEchtgenootEigenNaam, 4 = EigenNaamExEchtgenoot
     */
    val naamgebruik: Int,
    val geslachtsnaamPartner: String?,

    /**
     * 0 = geen beperking, 1 = niet zonder toestemming aan derden ter uitvoering van een algemeen verbindend voorschrift,
     * 2 = niet aan kerken,
     * 3 = niet aan vrije derden,
     * 4 = niet zonder toestemming aan derden ter uitvoering van een algemeen verbindend voorschrift en niet aan kerken,
     * 5 = niet zonder toestemming aan derden ter uitvoering van een algemeen verbindend voorschrift en niet aan vrije derden,
     * 6 = niet aan kerken en niet aan vrije derden,
     * 7 = niet zonder toestemming aan derden ter uitvoering van een algemeen verbindend voorschrift en niet aan vrije derden en niet aan kerken
     */
    val codeBrpGegevensGeheim: Int,

    /**
     * 0 = Onbekend, 1 = Nederlandse, 2 = BehandeldalsNederlander,
     * 27 = Slowaakse, 28 = Tsjechische, 29 = BurgervanBosniëHerzegovina,
     * 30 = Georgische, 31 = Turkmeense, 32 = Tadzjiekse, 33 = Oezbeekse,
     * 34 = Oekraïense, 35 = Kirgizische, 36 = Moldavische, 37 = Kazachse,
     * 38 = Belarussische, 39 = Azerbeidzjaanse, 40 = Armeense, 41 = Russische,
     * 42 = Sloveense, 43 = Kroatische, 44 = Letse, 45 = Estische, 46 = Litouwse,
     * 47 = Marshalleilandse, 48 = Myanmarese, 49 = Namibische, 50 = Albanese,
     * 51 = Andorrese, 52 = Belgische, 53 = Bulgaarse, 54 = Deense,
     * 55 = BurgervandeBondsrepubliekDuitsland, 56 = Finse, 57 = Franse,
     * 58 = Jemenitische, 59 = Griekse, 60 = Britsburger, 61 = Hongaarse,
     * 62 = Ierse, 63 = IJslandse, 64 = Italiaanse, 65 = Joegoslavische,
     * 66 = Liechtensteinse, 67 = Luxemburgse, 68 = Maltese, 69 = Monegaskische,
     * 70 = Noorse, 71 = Oostenrijkse, 72 = Poolse, 73 = Portugese, 74 = Roemeense,
     * 75 = BurgervandeSovjetUnie, 76 = SanMarinese, 77 = Spaanse,
     * 78 = TsjechoSlowaakse, 79 = Vaticaanse, 80 = Zweedse, 81 = Zwitserse,
     * 82 = OostDuitse, 83 = Britsonderdaan, 84 = Eritrese, 85 = Britsoverzeesburger,
     * 86 = Macedonische, 87 = Kosovaarse, 88 = BurgervandeRepubliekNoordMacedonië,
     * 100 = Algerijnse, 101 = Angolese, 104 = Burundese, 105 = Botswaanse,
     * 106 = Burkinese, 108 = CentraalAfrikaanse, 109 = Comorese,
     * 110 = BurgervanCongo, 111 = Beninse, 112 = Egyptische,
     * 113 = EquatoriaalGuinese, 114 = Ethiopische, 115 = Djiboutiaanse,
     * 116 = Gabonese, 117 = Gambiaanse, 118 = Ghanese, 119 = Guinese,
     * 120 = Ivoriaanse, 121 = Kaapverdische, 122 = Kameroense, 123 = Kenyaanse,
     * 124 = Zaïrese, 125 = Lesothaanse, 126 = Liberiaanse, 127 = Libische,
     * 128 = Malagassische, 129 = Malawische, 130 = Malinese, 131 = Marokkaanse,
     * 132 = Mauritaanse, 133 = Mauritiaanse, 134 = Mozambikaanse, 135 = Swazische,
     * 136 = Nigerese, 137 = Nigeriaanse, 138 = Ugandese, 139 = GuineeBissause,
     * 140 = ZuidAfrikaanse, 142 = Zimbabwaanse, 143 = Rwandese,
     * 144 = BurgervanSãoToméenPrincipe, 145 = Senegalese, 147 = SierraLeoonse,
     * 148 = Soedanese, 149 = Somalische, 151 = Tanzaniaanse, 152 = Togolese,
     * 154 = Tsjadische, 155 = Tunesische, 156 = Zambiaanse, 157 = ZuidSoedanese,
     * 200 = Bahamaanse, 202 = Belizaanse, 204 = Canadese, 205 = CostaRicaanse,
     * 206 = Cubaanse, 207 = Dominicaanse, 208 = Salvadoraanse, 211 = Guatemalaanse,
     * 212 = Haïtiaanse, 213 = Hondurese, 214 = Jamaicaanse, 216 = Mexicaanse,
     * 218 = Nicaraguaanse, 219 = Panamese, 222 = BurgervanTrinidadenTobago,
     * 223 = Amerikaansburger, 250 = Argentijnse, 251 = Barbadaanse,
     * 252 = Boliviaanse, 253 = Braziliaanse, 254 = Chileense, 255 = Colombiaanse,
     * 256 = Ecuadoraanse, 259 = Guyaanse, 261 = Paraguayaanse, 262 = Peruaanse,
     * 263 = Surinaamse, 264 = Uruguayaanse, 265 = Venezolaanse, 267 = Grenadaanse,
     * 268 = BurgervanSaintKittsenNevis, 300 = Afghaanse, 301 = Bahreinse,
     * 302 = Bhutaanse, 303 = Burmaanse, 304 = Bruneise, 305 = Cambodjaanse,
     * 306 = SriLankaanse, 307 = Chinese, 308 = Cyprische, 309 = Filipijnse,
     * 310 = Taiwanese, 312 = Indiase, 313 = Indonesische, 314 = Iraakse,
     * 315 = Iraanse, 316 = Israëlische, 317 = Japanse, 318 = NoordJemenitische,
     * 319 = Jordaanse, 320 = Koeweitse, 321 = Laotiaanse, 322 = Libanese,
     * 324 = Maldivische, 325 = Maleisische, 326 = Mongolische, 327 = Omaanse,
     * 328 = Nepalese, 329 = NoordKoreaanse, 331 = Pakistaanse, 333 = Qatarese,
     * 334 = SaoediArabische, 335 = Singaporese, 336 = Syrische, 337 = Thaise,
     * 338 = BurgervandeVerenigdeArabischeEmiraten, 339 = Turkse,
     * 340 = ZuidJemenitische, 341 = ZuidKoreaanse, 342 = Vietnamese,
     * 345 = Bengalese, 400 = Australische, 401 = PapoeaNieuwGuinese,
     * 402 = NieuwZeelandse, 404 = WestSamoaanse, 405 = Samoaanse,
     * 421 = BurgervanAntiguaenBarbuda, 424 = Vanuatuaanse, 425 = Fijische,
     * 429 = BurgervanBritseafhankelijkegebieden, 430 = Tongaanse, 431 = Nauruaanse,
     * 432 = Palause, 437 = Amerikaansonderdaan, 442 = Salomonseilandse,
     * 443 = Micronesische, 444 = Seychelse, 445 = Kiribatische, 446 = Tuvaluaanse,
     * 447 = SaintLuciaanse, 448 = BurgervanDominica,
     * 449 = BurgervanSaintVincentendeGrenadines, 450 = BritishNationalOverseas,
     * 451 = BurgervanDemocratischeRepubliekCongo, 452 = BurgervanTimorLeste,
     * 453 = BurgervanServiëenMontenegro, 454 = Servische, 455 = Montenegrijnse,
     * 499 = Staatloos, 500 = VastgesteldnietNederlander
     */
    val nationaliteit: List<Int>
)
