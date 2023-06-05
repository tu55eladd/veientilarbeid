import { Panel } from '@navikt/ds-react';

import { useAmplitudeData } from '../hent-initial-data/amplitude-provider';
import { useBrukerregistreringData } from '../../contexts/brukerregistrering';
import { useArbeidssokerPerioder } from '../../contexts/arbeidssoker';
import { useBesvarelse } from '../../contexts/besvarelse';
import { InnloggingsNiva, useAutentiseringData } from '../../contexts/autentisering';

import Sammendrag from './sammendrag';
import BesvarelseLesMer from '../innsyn/besvarelse-les-mer';
import beregnArbeidssokerperioder from '../../lib/beregn-arbeidssokerperioder';

import spacingStyles from '../../spacing.module.css';

function MinSituasjon(props: any) {
    const brukerregistreringData = useBrukerregistreringData();
    const arbeidssokerperiodeData = useArbeidssokerPerioder();
    const { amplitudeData } = useAmplitudeData();
    const autentiseringData = useAutentiseringData();
    const { besvarelse } = useBesvarelse();
    const besvarelseData = besvarelse ? besvarelse.besvarelse : null;

    const { aktivPeriodeStart } = beregnArbeidssokerperioder(arbeidssokerperiodeData);
    const { opprettetDato, manueltRegistrertAv } = brukerregistreringData?.registrering || {};
    const { endretTidspunkt, endretAv, erBesvarelseEndret } = besvarelse || {};
    const kanViseKomponent = autentiseringData.securityLevel === InnloggingsNiva.LEVEL_4;

    const endretStyle = erBesvarelseEndret ? { background: 'var(--a-blue-50' } : {};
    if (!kanViseKomponent) return null;

    return (
        <Panel className={`${spacingStyles.ml2_39}`} style={endretStyle}>
            <Sammendrag
                startDato={opprettetDato || aktivPeriodeStart}
                manueltRegistrertAv={manueltRegistrertAv}
                amplitudeData={amplitudeData}
                besvarelse={besvarelseData}
                endretTidspunkt={endretTidspunkt}
                endretAv={endretAv}
                erBesvarelseEndret={erBesvarelseEndret}
            />
            <BesvarelseLesMer />
        </Panel>
    );
}

export default MinSituasjon;
