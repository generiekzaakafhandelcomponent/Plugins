package com.ritense.valtimoplugins.socrates.model

data class RedenAanvraagLevensonderhoud(
    /**
     * 1 = IkHebGeenWerkMeer
     * 2 = IkHebWelInkomstenMaarTeLaag
     * 3 = UitkeringGeenBijstandStopgezet
     * 4 = BijstandsuitkeringStopgezet
     * 5 = BijstandsaanvraagAfgewezenOfNietInBehandeling
     * 6 = AlimentatieGestoptOfVerlaagd
     * 7 = StudiefinancieringGestopt
     * 8 = InStakingOfUitgeslotenVoorWerk
     * 9 = VanSpaargeldGeleefd
     * 10 = VrijNaGevangenisstraf
     * 11 = AndereReden
     */
    val onvoldoendeInkomen: String? = null,

    /**
     * 1 = WWUitkeringTeLaag
     * 2 = ZWUitkeringTeLaag
     * 3 = TeLaagInkomenUitParttimeWerk
     * 4 = AanvullingOpAndereInkomsten
     */
    val teLaagInkomen: String? = null,

    /**
     * 1 = EindeWWUitkering
     * 2 = EindeZWUitkering
     * 3 = EindeWGAUitkering
     * 4 = EindeWAOIVAUitkering
     * 5 = EindeOverigeUitkering
     */
    val uitkeringStopgezet: String? = null,

    /**
     * 1 = VerblijfsvergunningGekregen
     * 2 = VerblijfsvergunningGekregenEnVertrekUitAsielzoekerscentrum
     */
    val verblijfstatus: String? = null,

    /**
     * 1 = EigenUitkeringMaarNuSamenAanvraagMetPartner
     * 2 = RelatieVerbroken
     * 3 = PartnerOverleden
     */
    val wijzigingGezin: String? = null,

    /**
     * 1 = GestoptMetEigenBedrijf
     * 2 = EigenBedrijfOnvoldoendeInkomen
     * 3 = EigenBedrijfTijdelijkGeslotenDoorGemeente
     */
    val zelfstandige: String? = null,
)
