import { ForeslattInnsatsgruppe } from '../ducks/brukerregistrering';
import { erDemo } from '../utils/app-state-utils';
import { FormidlingsgruppeOrNull, ServicegruppeOrNull } from '../ducks/oppfolging';
import { RegistreringTypeOrIngenVerdi } from '../ducks/bruker-info';
import { CreatedMetrics } from './created-metrics';
import { amplitudeLogger } from './amplitude-utils'
import { uniLogger } from './uni-logger'


const createdMetrics = new CreatedMetrics();

const w = (window as any);

const domene = 'veientilarbeid';

const logEvent = w.frontendlogger ? (navn: string, fields: object, tags: object) => {
    if (erDemo()) {
        return;
    }

    const metrikkId = `${domene}.${navn}`;

    const metrikkAlleredeOpprettet = createdMetrics.alreadyCreated(metrikkId);

    if (metrikkAlleredeOpprettet) {
        w.frontendlogger.event(`${domene}.duplikat`, {}, {metrikk: metrikkId});
    }

    if (!metrikkAlleredeOpprettet) {
        w.frontendlogger.event(metrikkId, fields, tags);
        createdMetrics.registerCreatedMetric(metrikkId);
    }
} : () => { return; };

export const seVeientilarbeid = (
    erSykmeldtMedArbeidsgiver: boolean,
    servicegruppe: ServicegruppeOrNull,
    microfrontend: boolean,
    formidlingsgruppe: FormidlingsgruppeOrNull,
    rettighetsgruppe: String,
    dinSituasjon: String,
    underOppfolging: String,
    registreringType: RegistreringTypeOrIngenVerdi,
    fremtidigSituasjon: String,
    reservasjonKRR: string) =>
{
    logEvent('seveientilarbeid',
        {
            erSykmeldtMedArbeidsgiverField: erSykmeldtMedArbeidsgiver,
            servicegruppeField: servicegruppe,
            microfrontendField: microfrontend,
        },
        {
            erSykmeldtMedArbeidsgiver,
            servicegruppeTag: servicegruppe,
            microfrontendTag: microfrontend,
            formidlingsgruppe,
            rettighetsgruppe,
            dinSituasjon,
            underOppfolging,
            registreringType,
            fremtidigSituasjon,
            reservasjonKRR,
        });
    amplitudeLogger(`${domene}.visning`, {
        erSykmeldtMedArbeidsgiver,
        servicegruppe,
        microfrontend,
        formidlingsgruppe,
        rettighetsgruppe,
        dinSituasjon,
        underOppfolging,
        registreringType,
        fremtidigSituasjon,
        reservasjonKRR
    })
};

export const seVeientilarbeidNiva3 = () => {
    logEvent('seveientilarbeidniva3', {}, {});
};

export const seIARBSPlaster = (skalViseIARBSPlaster: boolean, formidlingsgruppe: String | null, servicegruppe: String | null, rettighetsgruppe: String) => {
    if (skalViseIARBSPlaster) {
        logEvent('viseriarbsplaster', {}, { formidlingsgruppeTag: formidlingsgruppe, servicegruppeTag: servicegruppe, rettighetsgruppe });
    }
}

export const klikkPaSokLedigeStillinger = (servicegruppe: String | null) => {
    logEvent('sokledigestillinger', {innsatsgruppeField: servicegruppe}, {innsatsgruppeTag: servicegruppe});
};

export const gaTilAktivitetsplan = (servicegruppe: String | null) => {
    logEvent('gatilaktivitetsplan', {innsatsgruppeField: servicegruppe}, {innsatsgruppeTag: servicegruppe});
};

export const gaTilDialog = (antall: number, servicegruppe: string | null) => {
    logEvent('gatildialog', {antallField: antall, innsatsgruppeField: servicegruppe}, {antallTag: antall, innsatsgruppeTag: servicegruppe});
};

export const gaTilDialogPermittert = (antall: number, servicegruppe: string | null) => {
    logEvent('gatildialogpermittert', {antallField: antall, innsatsgruppeField: servicegruppe}, {antallTag: antall, innsatsgruppeTag: servicegruppe});
};

export const antallUlesteDialoger = (antall: number) => {
    logEvent('antallulestedialoger', {antallField: antall}, {antallTag: antall});
};

export const gaTilMeldekort = (servicegruppe: String | null) => {
    logEvent('gatilmeldekort', {innsatsgruppeField: servicegruppe}, {innsatsgruppeTag: servicegruppe});
};

export const seEgenvurdering = (foreslaattinnsatsgruppe: ForeslattInnsatsgruppe) => {
    logEvent('seegenvurdering', {}, {foreslaattInnsatsgruppe: foreslaattinnsatsgruppe});
};

export const gaTilEgenvurdering = (antallTimer: number, foreslaattinnsatsgruppe: ForeslattInnsatsgruppe) => {
    logEvent('gatilegenvurdering', {antallTimer: antallTimer}, {foreslaattInnsatsgruppe: foreslaattinnsatsgruppe});
};

export const gaTilDittSykefravaer = (servicegruppe: String | null) => {
    logEvent('gatildittsykefravaer', {innsatsgruppeField: servicegruppe}, {innsatsgruppeTag: servicegruppe});
};

export const gaTilCV = (servicegruppe: String | null) => {
    logEvent('gatilcv', {innsatsgruppeField: servicegruppe}, {innsatsgruppeTag: servicegruppe});
};

export const gaTilJobbsokerkompetanse = (servicegruppe: String | null) => {
    logEvent('gatiljobbsokerkompetanseresultat', {innsatsgruppeField: servicegruppe}, {innsatsgruppeTag: servicegruppe});
};

export const gaTilVeiviserarbeidssoker = (servicegruppe: String | null) => {
    logEvent('gatilveiviserarbeidssoker', {innsatsgruppeField: servicegruppe}, {innsatsgruppeTag: servicegruppe});
};

export const klikkPaSoknadAlleSkjema = (servicegruppe: string | null) => {
    logEvent('soknaddagpenger', {innsatsgruppeField: servicegruppe}, {innsatsgruppeTag: servicegruppe});
};

export const klikkPaSoknadDagpenger = (servicegruppe: string | null) => {
    logEvent('soknaddagpenger', {innsatsgruppeField: servicegruppe}, {innsatsgruppeTag: servicegruppe});
};

export const lesOmOkonomi = (stonad: string, servicegruppe: string | null) => {
    logEvent('lesomokonomi', {stonadField: stonad, innsatsgruppeField: servicegruppe}, {stonadTag: stonad, innsatsgruppeTag: servicegruppe});
};

type StandardMetrikkData = {
    servicegruppe: ServicegruppeOrNull;
    formidlingsgruppe: FormidlingsgruppeOrNull;
    rettighetsgruppe: string;
    dinSituasjon: string;
    underOppfolging: string;
    registreringType: RegistreringTypeOrIngenVerdi;
}

export const seDineOpplysninger = (metrikker: StandardMetrikkData) => {
    uniLogger('viser.dineopplysninger', metrikker);
};

export const klikkPaDineOpplysninger = (metrikker: StandardMetrikkData) => {
    uniLogger('click.dineopplysninger', metrikker);
};

export const klikkPaEndreDineOpplysninger = (metrikker: StandardMetrikkData) => {
    uniLogger('click.endredineopplysninger', metrikker);
};

interface KrrMetrikkData extends StandardMetrikkData {
    reservasjonKRR: string;
}

export const klikkPaDifiLenke = (metrikker: KrrMetrikkData) => {
    uniLogger('krr.difi.click', metrikker);
};