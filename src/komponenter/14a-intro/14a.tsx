import sjekkOmBrukerErStandardInnsatsgruppe from '../../lib/er-standard-innsatsgruppe';
import sjekkOmBrukerErSituasjonsbestemtInnsatsgruppe from '../../lib/er-situasjonsbestemt-innsatsgruppe';
import * as Brukerregistrering from '../../ducks/brukerregistrering';
import * as Oppfolging from '../../ducks/oppfolging';
import { FeaturetoggleContext } from '../../ducks/feature-toggles';
import Kortbunke from './Kortbunke';
import React from 'react';

function Onboarding14A(): JSX.Element | null {
    const { data: registreringData } = React.useContext(Brukerregistrering.BrukerregistreringContext);
    const { data: oppfolgingData } = React.useContext(Oppfolging.OppfolgingContext);
    const { data: featuretoggleData } = React.useContext(FeaturetoggleContext);

    const brukerregistreringData = registreringData?.registrering ?? null;
    const erStandardInnsatsgruppe = sjekkOmBrukerErStandardInnsatsgruppe({ brukerregistreringData, oppfolgingData });
    const erSituasjonsbestemtInnsatsgruppe = sjekkOmBrukerErSituasjonsbestemtInnsatsgruppe({
        brukerregistreringData,
        oppfolgingData,
    });
    const ikkeStandardToggle = featuretoggleData['veientilarbeid.14a-intro.ikke-standard'];

    const kanViseSituasjonsbestemt = erSituasjonsbestemtInnsatsgruppe && ikkeStandardToggle;
    const kanViseKomponent = erStandardInnsatsgruppe || kanViseSituasjonsbestemt;
    if (!kanViseKomponent) return null;

    if (erStandardInnsatsgruppe) {
        return <Kortbunke />;
    }

    return null;
}

export default Onboarding14A;
