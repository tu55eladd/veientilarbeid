import { useEffect, useState } from 'react';
import * as React from 'react';
import { Close, SuccessColored } from '@navikt/ds-icons';
import { Button, Detail, Heading, BodyShort, Panel } from '@navikt/ds-react';

import { useFeatureToggleData } from '../../contexts/feature-toggles';
import { useAmplitudeData } from '../../contexts/amplitude-context';
import { loggAktivitet } from '../../metrics/metrics';
import ErRendret from '../er-rendret/er-rendret';
import InViewport from '../in-viewport/in-viewport';
import { settIBrowserStorage } from '../../utils/browserStorage-utils';
import { fjernQueryParam } from '../../utils/query-param-utils';
import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import { useSprakValg } from '../../contexts/sprak';

export const HAR_MOTTATT_EGENVURDERING_KVITTERING = 'har_mottatt_egenvurdering_kvittering';

interface EndStateProps {
    lukkerKvittering: (loggTekst: string) => void;
    kvittering?: string;
}

const TEKSTER: Tekster<string> = {
    nb: {
        egenvurdering: 'Egenvurdering',
        heading: 'Svaret ditt er delt med din veileder',
        svar: 'Du får svar i løpet av noen dager.',
        ok: 'Ok',
    },
    en: {
        egenvurdering: 'Self assessment',
        heading: 'Your answer has been shared with your counselor',
        svar: 'You will get a reply within a couple of days.',
        ok: 'Ok',
    },
};

function Sluttkort(props: EndStateProps) {
    const svarerJa = props.kvittering && props.kvittering === 'behovsvurderingJa';

    function handleLukkeKvitteringKnapp(event: React.SyntheticEvent, fraKnapp: string) {
        event.preventDefault();
        event.stopPropagation();
        props.lukkerKvittering(`Lukker kvittering fra behovsvurderingen: ${fraKnapp}`);
    }

    useEffect(() => {
        settIBrowserStorage(HAR_MOTTATT_EGENVURDERING_KVITTERING, 'true');
    }, []);

    const tekst = lagHentTekstForSprak(TEKSTER, useSprakValg().sprak);

    return (
        <>
            <Panel className={'blokk-s flex px-1_5 '}>
                <span
                    style={{
                        marginRight: '0.5em',
                        position: 'relative',
                        top: '6px',
                        fontSize: 'var(--navds-font-size-heading-medium)',
                    }}
                >
                    <SuccessColored />
                </span>
                <div className="full-width">
                    <div className="flex space-between blokk-xs">
                        <div>
                            <Detail uppercase style={{ marginTop: '-1rem' }}>
                                {tekst('egenvurdering')}
                            </Detail>
                            <Heading size="medium">{tekst('heading')}</Heading>
                        </div>
                        <Button
                            variant="tertiary"
                            size="small"
                            onClick={(e) => handleLukkeKvitteringKnapp(e, 'kryss-knapp')}
                        >
                            <Close color="black" />
                        </Button>
                    </div>

                    {svarerJa && (
                        <div>
                            <BodyShort>{tekst('svar')}</BodyShort>
                        </div>
                    )}
                </div>
            </Panel>
        </>
    );
}

function KvitteringEgenvurdering() {
    const featureToggles = useFeatureToggleData();
    const amplitudeData = useAmplitudeData();
    const [kvittering, setKvittering] = useState('');
    const [visKomponent, setVisKomponent] = useState(true);

    useEffect(() => {
        setKvittering(new URLSearchParams(window.location.search).get('visKvittering') || '');
    }, []);

    function lukkerKvittering(loggTekst: string) {
        loggAktivitet({ aktivitet: loggTekst, ...amplitudeData });
        fjernQueryParam('visKvittering');
        setVisKomponent(false);
    }

    if (!visKomponent) return null;
    if (!featureToggles['veientilarbeid.ny-standardvisning']) return null;
    if (!['behovsvurderingJa', 'behovsvurderingNei'].includes(kvittering)) return null;

    return (
        <div>
            <Sluttkort lukkerKvittering={lukkerKvittering} kvittering={kvittering} />
            <ErRendret loggTekst="Rendrer kvittering behovsundersøkelse" />
            <InViewport loggTekst="Viser kvittering behovsundersøkelse i viewport" />
        </div>
    );
}

export default KvitteringEgenvurdering;
