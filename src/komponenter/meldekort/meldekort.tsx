import { useState } from 'react';
import { Detail, Panel, ReadMore } from '@navikt/ds-react';
import { ClipboardIcon } from '@navikt/aksel-icons';

import { useSprakValg } from '../../contexts/sprak';
import { useAmplitudeData } from '../hent-initial-data/amplitude-provider';

import MeldekortHovedInnhold from './meldekort-hovedinnhold';
import MeldekortForklaring from './meldekort-forklaring';
import lagHentTekstForSprak from '../../lib/lag-hent-tekst-for-sprak';
import { loggAktivitet } from '../../metrics/metrics';

import spacingStyles from '../../spacing.module.css';
import flexStyles from '../../flex.module.css';
import responsiveStyles from '../../responsive.module.css';

import useSkalBrukeTabs from '../../hooks/use-skal-bruke-tabs';

const TEKSTER = {
    nb: {
        overskrift: 'Hvorfor må jeg sende meldekort?',
    },
    en: {
        overskrift: 'Why do I need to submit an employment status form?',
    },
};

function Meldekort() {
    const [clickedLesMer, setClickedLesMer] = useState(false);
    const { amplitudeData } = useAmplitudeData();
    const sprak = useSprakValg().sprak;
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);
    const brukTabsDemo = useSkalBrukeTabs();

    const handleClickLesMer = () => {
        if (!clickedLesMer) {
            loggAktivitet({ aktivitet: 'Leser forklaringen for meldekort', ...amplitudeData });
            setClickedLesMer(true);
        }
    };

    return (
        <Panel className={`${flexStyles.flex} ${spacingStyles.px1_5}`}>
            <span className={responsiveStyles.panelIcon}>
                <ClipboardIcon aria-hidden="true" />
            </span>
            <div className={spacingStyles.fullWidth}>
                {!brukTabsDemo && (
                    <Detail uppercase style={{ marginTop: '-1rem' }}>
                        Meldekort og meldeplikt
                    </Detail>
                )}
                <MeldekortHovedInnhold />

                <ReadMore size="medium" header={tekst('overskrift')} onClick={handleClickLesMer}>
                    <MeldekortForklaring />
                </ReadMore>
            </div>
        </Panel>
    );
}

export default Meldekort;
