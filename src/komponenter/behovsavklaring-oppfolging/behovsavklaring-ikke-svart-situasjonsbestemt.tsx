import { Dialog } from '@navikt/ds-icons';
import { BodyLong, BodyShort, Button, Heading } from '@navikt/ds-react';

import { useSprakValg } from '../../contexts/sprak';
import { useBehovForVeiledning } from '../../contexts/behov-for-veiledning';

import lagHentTekstForSprak from '../../lib/lag-hent-tekst-for-sprak';
import { loggAktivitet } from '../../metrics/metrics';
import ReadMoreVeileder from './readmore-veileder';
import ReadMoreVurdering from './readmore-vurdering';
import ErRendret from '../er-rendret/er-rendret';
import InViewport from '../in-viewport/in-viewport';
import { ForeslattInnsatsgruppe } from '../../contexts/brukerregistrering';
import { ListeElement } from '../situasjonsbestemt/situasjonsbestemt';

import spacingStyles from '../../spacing.module.css';
import { useState } from 'react';
import { useAmplitudeData } from '../hent-initial-data/amplitude-provider';

const TEKSTER = {
    nb: {
        overskrift: 'Hjelp og støtte',
        heading: 'Ønsker du hjelp fra en veileder?',
        beskrivelse: 'Vi tror du vil trenge hjelp fra en veileder for å nå ditt mål om arbeid.',
        hvaTenkerDu: 'Hva tenker du?',
        klareDegSelv: 'Ønsker du å få hjelp fra en veileder?',
        readMoreHeading: 'Hva slags hjelp kan jeg få?',
        behovOverskrift: 'Mitt behov for veiledning',
        behovSvarEnig:
            'Spørsmål: Ønsker du å få hjelp fra en veileder?\n\nMitt svar: Ja, jeg ønsker hjelp\n\nDette er en automatisk generert melding',
        behovSvarUenig:
            'Spørsmål: Ønsker du å få hjelp fra en veileder?\n\nMitt svar: Nei, jeg vil gjerne klare meg selv\n\nDette er en automatisk generert melding',
    },
    en: {
        heading: 'Get in touch if you need help',
        readMoreHeading: 'What kind of help can I get?',
    },
};

function IkkeSvartPaaBehovsavklaringSituasjonsbestemt() {
    const { lagreBehovForVeiledning } = useBehovForVeiledning();
    const { amplitudeData } = useAmplitudeData();
    const sprak = useSprakValg().sprak;
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);
    const [pendingRequest, settPendingRequest] = useState<ForeslattInnsatsgruppe | null>(null);

    async function onLagreBehovForVeiledning(behov: ForeslattInnsatsgruppe) {
        settPendingRequest(behov);
        try {
            await lagreBehovForVeiledning({
                oppfolging: behov,
                overskrift: tekst('behovOverskrift'),
                tekst: tekst(
                    behov === ForeslattInnsatsgruppe.SITUASJONSBESTEMT_INNSATS ? 'behovSvarEnig' : 'behovSvarUenig'
                ),
            });
            loggAktivitet({
                ...amplitudeData,
                aktivitet: `Velger ${behov} fra behovsavklaringkomponent - ikke svart - situasjonsbestemt`,
            });
        } finally {
            settPendingRequest(null);
        }
    }

    return ListeElement(
        <Dialog aria-hidden="true" />,
        <div className={spacingStyles.fullWidth}>
            <ErRendret loggTekst="Rendrer behovsavklaringkomponent - ikke svart - situasjonsbestemt" />
            <Heading className={spacingStyles.mb1} size="medium">
                {tekst('heading')}
            </Heading>
            <BodyLong className={`${spacingStyles.mb1}`}>{tekst('beskrivelse')}</BodyLong>
            <BodyShort className={`${spacingStyles.mb1}`}>{tekst('hvaTenkerDu')}</BodyShort>
            <BodyShort className={`${spacingStyles.mb1}`}>{tekst('klareDegSelv')}</BodyShort>
            <Button
                onClick={() => onLagreBehovForVeiledning(ForeslattInnsatsgruppe.SITUASJONSBESTEMT_INNSATS)}
                disabled={pendingRequest !== null}
                loading={pendingRequest === ForeslattInnsatsgruppe.SITUASJONSBESTEMT_INNSATS}
            >
                Ja, jeg ønsker hjelp
            </Button>
            <div className={spacingStyles.mb1}>
                <Button
                    onClick={() => onLagreBehovForVeiledning(ForeslattInnsatsgruppe.STANDARD_INNSATS)}
                    disabled={pendingRequest !== null}
                    loading={pendingRequest === ForeslattInnsatsgruppe.STANDARD_INNSATS}
                    variant="secondary"
                    className={`${spacingStyles.mt1}`}
                >
                    Nei, jeg vil gjerne klare meg selv
                </Button>
            </div>
            <ReadMoreVeileder />
            <ReadMoreVurdering />
            <InViewport loggTekst="Viser behovsavklaringkomponent - ikke svart - situasjonsbestemt i viewport" />
        </div>
    );
}

export default IkkeSvartPaaBehovsavklaringSituasjonsbestemt;
