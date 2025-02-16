import AuthResponse from './auth-mock';
import ulesteDialogerResponse from './ulestedialoger-mock';
import brukerRegistreringResponse from './brukerregistrering-standard-mock';
import motestotteResponse from './motestotte-mock';
import featureTogglesResponse from './feature-toggles-mock';
import brukerInfoResponse from './bruker-info-mock';
import oppfolgingResponse from './oppfolging-mock';
import meldekortResponse from './meldekort-mock';
import meldekortstatusResponse from './meldekortstatus-mock';
import dpSoknadResonse from './dp-innsyn-soknad';
import dpVedtakResponse from './dp-innsyn-vedtak';
import dpPaabegynteResponse from './dp-innsyn-paabegynte';
import msw_get, { msw_post } from './msw-utils';
import {
    BRUKERINFO_URL,
    BRUKERREGISTRERING_URL,
    FEATURE_URL,
    MELDEKORTSTATUS_URL,
    MOTESTOTTE_URL,
    NESTE_MELDEKORT_URL,
    ULESTEDIALOGER_URL,
    VEILARBOPPFOLGING_URL,
    DP_INNSYN_URL,
    GJELDER_FRA_DATO_URL,
    AUTH_API,
    ARBEIDSSOKER_NIVA3_URL,
    ER_STANDARD_INNSATSGRUPPE_URL,
    MELDEPLIKT_URL,
    DAGPENGER_STATUS,
    ANTATT_INAKTIVERINGSGRUNN,
    REAKTIVERING_URL,
    BEHOV_FOR_VEILEDNING_URL,
    PROFIL_URL,
} from '../ducks/api';
import gjelderFraGetResponse from './gjelderfra-mock';
import arbeidssokerNiva3Response from './arbeidssoker-niva3-mock';
import levertMeldekortMock from './meldeplikt-hendelser.mock';

export const handlers = [
    msw_get(AUTH_API, AuthResponse),
    msw_get(MOTESTOTTE_URL, motestotteResponse, 204),
    msw_get(FEATURE_URL, featureTogglesResponse),
    msw_get(BRUKERREGISTRERING_URL, brukerRegistreringResponse),
    msw_get(ULESTEDIALOGER_URL, ulesteDialogerResponse),
    msw_get(BRUKERINFO_URL, brukerInfoResponse),
    msw_get(VEILARBOPPFOLGING_URL, oppfolgingResponse),
    msw_get(NESTE_MELDEKORT_URL, meldekortResponse),
    msw_get(MELDEKORTSTATUS_URL, meldekortstatusResponse),
    msw_get(`${DP_INNSYN_URL}/soknad`, dpSoknadResonse),
    msw_get(`${DP_INNSYN_URL}/vedtak`, dpVedtakResponse),
    msw_get(`${DP_INNSYN_URL}/paabegynte`, dpPaabegynteResponse),
    msw_get(GJELDER_FRA_DATO_URL, gjelderFraGetResponse),
    msw_post(GJELDER_FRA_DATO_URL, null, 201),
    msw_get(ARBEIDSSOKER_NIVA3_URL, arbeidssokerNiva3Response(true, null)),
    msw_get(ER_STANDARD_INNSATSGRUPPE_URL, true),
    msw_get(`${MELDEPLIKT_URL}/siste`, levertMeldekortMock(true)),
    msw_get(DAGPENGER_STATUS, { dagpengerStatus: 'ukjent', antallDagerSidenDagpengerStanset: 'N/A' }),
    msw_get(ANTATT_INAKTIVERINGSGRUNN, { meldekortStatus: 'N/A' }),
    msw_get(BEHOV_FOR_VEILEDNING_URL, null, 204),
    msw_get(PROFIL_URL, null, 204),
    msw_get(REAKTIVERING_URL, null, 204),
];
