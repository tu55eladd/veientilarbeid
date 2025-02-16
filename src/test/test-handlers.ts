import msw_get, { msw_post } from '../mocks/msw-utils';
import {
    ARBEIDSSOKER_NIVA3_URL,
    AUTH_API,
    BRUKERINFO_URL,
    BRUKERREGISTRERING_URL,
    DP_INNSYN_URL,
    ER_STANDARD_INNSATSGRUPPE_URL,
    FEATURE_URL,
    GJELDER_FRA_DATO_URL,
    MELDEKORTSTATUS_URL,
    MOTESTOTTE_URL,
    NESTE_MELDEKORT_URL,
    PROFIL_URL,
    ULESTEDIALOGER_URL,
    VEILARBOPPFOLGING_URL,
    REAKTIVERING_URL,
} from '../ducks/api';
import { authenticatedMock } from '../mocks/auth-mock';
import { InnloggingsNiva } from '../contexts/autentisering';
import arbeidssoker from '../mocks/arbeidssoker-niva3-mock';
import { AMPLITUDE_ENDPOINT } from '../utils/konstanter';
import motestotteResponse from '../mocks/motestotte-mock';
import brukerRegistreringResponse from '../mocks/brukerregistrering-standard-mock';
import ulesteDialogerResponse from '../mocks/ulestedialoger-mock';
import brukerInfoResponse from '../mocks/bruker-info-mock';
import oppfolgingResponse from '../mocks/oppfolging-mock';
import meldekortResponse from '../mocks/meldekort-mock';
import meldekortstatusResponse from '../mocks/meldekortstatus-mock';
import dpSoknadResonse from '../mocks/dp-innsyn-soknad';
import dpVedtakResponse from '../mocks/dp-innsyn-vedtak';
import dpPaabegynteResponse from '../mocks/dp-innsyn-paabegynte';
import gjelderFraGetResponse from '../mocks/gjelderfra-mock';

export const initielleKallHandlers = [
    msw_get(AUTH_API, authenticatedMock(InnloggingsNiva.LEVEL_4)),
    msw_get(ARBEIDSSOKER_NIVA3_URL.split('?')[0], arbeidssoker(true, 'aktiv')),
    msw_get(FEATURE_URL, {}),
    msw_post(AMPLITUDE_ENDPOINT, ''),
    msw_get(PROFIL_URL, {}),
    msw_post('https://amplitude.nav.no/collect', {}),
    msw_get(GJELDER_FRA_DATO_URL, gjelderFraGetResponse),
    msw_post(GJELDER_FRA_DATO_URL, null, 201),
];

export const standardHandlers = [
    msw_get(ER_STANDARD_INNSATSGRUPPE_URL, true),
    msw_get(MOTESTOTTE_URL, motestotteResponse, 204),
    msw_get(BRUKERREGISTRERING_URL, brukerRegistreringResponse),
    msw_get(ULESTEDIALOGER_URL, ulesteDialogerResponse),
    msw_get(BRUKERINFO_URL, brukerInfoResponse),
    msw_get(VEILARBOPPFOLGING_URL, oppfolgingResponse),
    msw_get(NESTE_MELDEKORT_URL, meldekortResponse),
    msw_get(MELDEKORTSTATUS_URL, meldekortstatusResponse),
    msw_get(`${DP_INNSYN_URL}/soknad`, dpSoknadResonse),
    msw_get(`${DP_INNSYN_URL}/vedtak`, dpVedtakResponse),
    msw_get(`${DP_INNSYN_URL}/paabegynte`, dpPaabegynteResponse),
    msw_get(REAKTIVERING_URL, null, 204),
];

export const ikkeStandardHandlers = [
    msw_get(ER_STANDARD_INNSATSGRUPPE_URL, false),
    msw_get(MOTESTOTTE_URL, motestotteResponse, 204),
    msw_get(BRUKERREGISTRERING_URL, brukerRegistreringResponse),
    msw_get(BRUKERINFO_URL, brukerInfoResponse),
    msw_get(VEILARBOPPFOLGING_URL, oppfolgingResponse),
    msw_get(REAKTIVERING_URL, null, 204),
];
