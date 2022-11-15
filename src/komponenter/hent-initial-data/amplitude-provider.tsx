import * as React from 'react';
import ukerFraDato from '@alheimsins/uker-fra-dato';
import { useAutentiseringData } from '../../contexts/autentisering';
import { AmplitudeContext } from '../../contexts/amplitude-context';
import { DinSituasjonSvar, useBrukerregistreringData } from '../../contexts/brukerregistrering';
import { OppfolgingContext } from '../../contexts/oppfolging';
import { useBrukerinfoData } from '../../contexts/bruker-info';
import { useFeatureToggleData } from '../../contexts/feature-toggles';
import grupperGeografiskTilknytning from '../../utils/grupper-geografisk-tilknytning';
import beregnArbeidssokerperioder from '../../lib/beregn-arbeidssokerperioder';
import { datoUtenTid } from '../../utils/date-utils';
import dagerFraDato from '../../utils/dager-fra-dato';
import { AmplitudeData } from '../../metrics/amplitude-utils';
import erStandardInnsatsgruppe from '../../lib/er-standard-innsatsgruppe';
import sjekkOmBrukerErSituasjonsbestemtInnsatsgruppe from '../../lib/er-situasjonsbestemt-innsatsgruppe';
import erSannsynligvisInaktivertStandardbruker from '../../lib/er-sannsyligvis-inaktivert-standard-innsatsgruppe';
import { useArbeidssokerPerioder, useUnderOppfolging } from '../../contexts/arbeidssoker';
import * as SprakValg from '../../contexts/sprak';
import * as Meldekort from '../../hooks/use-meldekortdata';
import { hentMeldegruppeForNesteMeldekort, hentMeldekortForLevering } from '../../utils/meldekort-utils';

const hentSprakValgFraCookie = (): SprakValg.Sprak | null => {
    const decoratorLanguageCookie = document.cookie.match(/decorator-language=([a-z]{2})/);
    return decoratorLanguageCookie && (decoratorLanguageCookie[1] as SprakValg.Sprak);
};

export const AmplitudeProvider = (props: { children: React.ReactNode }) => {
    const brukerregistreringData = useBrukerregistreringData();
    const featuretoggleData = useFeatureToggleData();
    const oppfolgingData = React.useContext(OppfolgingContext).data;
    const brukerInfoData = useBrukerinfoData();
    const { securityLevel: nivaa } = useAutentiseringData();
    const arbeidssokerperioder = useArbeidssokerPerioder();
    const underOppfolging = useUnderOppfolging()?.underoppfolging;

    const { erSykmeldtMedArbeidsgiver, alder, geografiskTilknytning, registreringType, rettighetsgruppe } =
        brukerInfoData;
    const { servicegruppe, formidlingsgruppe, kanReaktiveres, reservasjonKRR } = oppfolgingData;
    const opprettetRegistreringDatoString = brukerregistreringData?.registrering?.opprettetDato;
    const dinSituasjon = brukerregistreringData?.registrering?.besvarelse.dinSituasjon || DinSituasjonSvar.INGEN_VERDI;
    const opprettetRegistreringDato = opprettetRegistreringDatoString
        ? new Date(opprettetRegistreringDatoString)
        : null;
    const geografiskTilknytningOrIngenVerdi = geografiskTilknytning || 'INGEN_VERDI';
    const ukerRegistrert = opprettetRegistreringDato ? ukerFraDato(opprettetRegistreringDato) : 'INGEN_DATO';
    const dagerRegistrert = opprettetRegistreringDato ? dagerFraDato(opprettetRegistreringDato) : 'INGEN_DATO';
    const servicegruppeOrIVURD = servicegruppe || 'IVURD';
    const foreslattInnsatsgruppeOrIngenVerdi =
        brukerregistreringData?.registrering?.profilering?.innsatsgruppe || 'INGEN_VERDI';
    const formidlingsgruppeOrIngenVerdi = formidlingsgruppe || 'INGEN_VERDI';

    const forsterketUngdomsinnsats = alder < 30;

    const aktiveFeatureToggles = Object.keys(featuretoggleData).reduce((toggles, current) => {
        if (featuretoggleData[current]) {
            toggles.push(current);
        }
        return toggles;
    }, [] as string[]);

    const brukerregistreringDataEllerNull = brukerregistreringData?.registrering ?? null;

    const brukerErStandardInnsatsgruppe = erStandardInnsatsgruppe({
        brukerregistreringData: brukerregistreringDataEllerNull,
        oppfolgingData,
    });

    const brukerErUngMedStandardInnsatsgruppe = brukerErStandardInnsatsgruppe && forsterketUngdomsinnsats;

    const brukerErSituasjonsbestemtInnsatsgruppe = sjekkOmBrukerErSituasjonsbestemtInnsatsgruppe({
        brukerregistreringData: brukerregistreringDataEllerNull,
        oppfolgingData,
    });

    const sannsynligvisInaktivertStandardbruker = erSannsynligvisInaktivertStandardbruker({
        brukerregistreringData: brukerregistreringDataEllerNull,
        oppfolgingData,
    });

    const beregnedeArbeidssokerPerioder = beregnArbeidssokerperioder(arbeidssokerperioder);

    const {
        harAktivArbeidssokerperiode,
        antallDagerSidenSisteArbeidssokerperiode,
        antallUkerSidenSisteArbeidssokerperiode,
        antallUkerMellomSisteArbeidssokerperioder,
    } = beregnedeArbeidssokerPerioder;

    const brukergruppering = brukerErUngMedStandardInnsatsgruppe
        ? 'standard og ungdomsinnsats'
        : brukerErStandardInnsatsgruppe
        ? 'standard'
        : brukerErSituasjonsbestemtInnsatsgruppe
        ? 'situasjonsbestemt'
        : sannsynligvisInaktivertStandardbruker
        ? 'sannsynligvis standard og inaktivert'
        : 'annet';

    const valgtSprak = hentSprakValgFraCookie();
    const sprakValgFraCookie = valgtSprak || 'IKKE_VALGT';

    const data: AmplitudeData = {
        brukergruppe: brukergruppering,
        geografiskTilknytning: grupperGeografiskTilknytning(geografiskTilknytningOrIngenVerdi),
        ukerRegistrert,
        dagerRegistrert,
        nivaa,
        kanReaktiveres: kanReaktiveres ? 'ja' : 'nei',
        formidlingsgruppe: formidlingsgruppeOrIngenVerdi,
        servicegruppe: servicegruppeOrIVURD,
        foreslattInnsatsgruppe: foreslattInnsatsgruppeOrIngenVerdi,
        underOppfolging: underOppfolging ? 'ja' : 'nei',
        rettighetsgruppe: rettighetsgruppe || 'INGEN_VERDI',
        registreringType: registreringType || 'INGEN_VERDI',
        gitVersion: process.env.REACT_APP_VERSION_HASH || 'INGEN_VERDI',
        buildTimestamp: process.env.REACT_APP_BUILD_TIMESTAMP || new Date().toISOString(),
        erSykmeldtMedArbeidsgiver: erSykmeldtMedArbeidsgiver ? 'ja' : 'nei',
        dinSituasjon,
        reservasjonKRR: reservasjonKRR ? 'ja' : 'nei',
        aktiveFeatureToggles,
        sprakValgFraCookie,
        harAktivArbeidssokerperiode,
        antallDagerSidenSisteArbeidssokerperiode,
        antallUkerSidenSisteArbeidssokerperiode,
        antallUkerMellomSisteArbeidssokerperioder,
        meldegruppe: 'INGEN_VERDI',
        antallMeldekortKlareForLevering: 0,
        vilFortsattVaereRegistrert: 'INGEN_DATA',
    };

    const [amplitudeData, setAmplitudeData] = React.useState(data);

    const setMeldekortData = (data: Meldekort.Data) => {
        const iDag = datoUtenTid(new Date().toISOString());
        const antallMeldekortKlareForLevering = hentMeldekortForLevering(iDag, data).length;
        const meldegruppe = data ? hentMeldegruppeForNesteMeldekort(data) : null;

        setAmplitudeData({
            ...amplitudeData,
            meldegruppe: meldegruppe ? meldegruppe : 'INGEN_VERDI',
            antallMeldekortKlareForLevering: antallMeldekortKlareForLevering,
        });
    };

    const oppdaterAmplitudeData = (data: Partial<AmplitudeData>) => {
        setAmplitudeData({
            ...amplitudeData,
            ...data,
        });
    };

    return (
        <AmplitudeContext.Provider value={{ amplitudeData, setMeldekortData, oppdaterAmplitudeData }}>
            {props.children}
        </AmplitudeContext.Provider>
    );
};
