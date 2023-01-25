import { useState } from 'react';
import { Button, Checkbox, CheckboxGroup, Textarea } from '@navikt/ds-react';

import { useSprakValg } from '../../contexts/sprak';
import { useBehovForVeiledning } from '../../contexts/behov-for-veiledning';
import { useFeatureToggleData, FeatureToggles } from '../../contexts/feature-toggles';

import lagHentTekstForSprak from '../../lib/lag-hent-tekst-for-sprak';

import spacingStyles from '../../spacing.module.css';

const TEKSTER = {
    nb: {
        overskrift: 'Hjelp og støtte',
        headingEnig: 'Du ønsker å klare deg selv',
        headingUenig: 'Du har sagt at du ønsker hjelp',
        beskrivelseEnig: 'Du har ansvar for å aktivt lete etter jobber og å søke på relevante stillinger på egenhånd.',
        hvaTenkerDu: 'Hva tenker du?',
        klareDegSelv: 'Ønsker du å klare deg selv?',
        readMoreHeadingEnig: 'Gi beskjed dersom du likevel ønsker veiledning',
        readMoreInnholdEnig: 'Du kan når som helst ta kontakt for å starte samhandling med en veileder.',
        veiledningTemaOverskrift: 'Hva ønsker du veiledning på?',
        beskrivelseAvVeiledningsbehovTittel: 'Skriv kort hva du trenger hjelp til',
        feilmelding: 'Du må velge emne for veildening også',
        sendInnKnapp: 'Send til veileder',
    },
    en: {
        heading: 'Get in touch if you need help',
        readMoreHeading: 'What kind of help can I get?',
    },
};

function TemaForVeiledningSkjema() {
    const [valgteTema, setValgteTema] = useState<string[]>([]);
    const [tilleggsinformasjon, setTilleggsinformasjon] = useState('');
    const [harSvart, setHarSvart] = useState(false);
    const { behovForVeiledning } = useBehovForVeiledning();
    const toggles = useFeatureToggleData();
    const sprak = useSprakValg().sprak;
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    function harIkkeValgtTema() {
        return valgteTema.length === 0 && tilleggsinformasjon !== '';
    }

    function handleInnsending() {
        if (!harIkkeValgtTema()) {
            console.log(valgteTema);
            console.log(tilleggsinformasjon);
            console.log(behovForVeiledning?.dialogId);
            // Kode for å sende inn svarene
            setHarSvart(true);
        }
    }

    if (!toggles[FeatureToggles.BRUK_VEILEDNING_SKJEMA]) return null;
    if (harSvart) return null;

    return (
        <>
            <CheckboxGroup
                legend={tekst('veiledningTemaOverskrift')}
                onChange={(valgte: any[]) => setValgteTema(valgte)}
            >
                <Checkbox value={'dagpenger'}>Dagpenger</Checkbox>
                <Checkbox value={'meldekort'}>Meldekort</Checkbox>
                <Checkbox value={'tiltak'}>Utdanning/kurs/tiltak</Checkbox>
                <Checkbox value={'jobbsoking'}>Søke jobb</Checkbox>
                <Checkbox value={'annet'}>Annet</Checkbox>
            </CheckboxGroup>
            <Textarea
                label={tekst('beskrivelseAvVeiledningsbehovTittel')}
                onChange={(event) => setTilleggsinformasjon(event.target.value)}
                error={harIkkeValgtTema() ? tekst('feilmelding') : ''}
            ></Textarea>
            <Button className={spacingStyles.mt1} onClick={() => handleInnsending()}>
                {tekst('sendInnKnapp')}
            </Button>
        </>
    );
}

export default TemaForVeiledningSkjema;
