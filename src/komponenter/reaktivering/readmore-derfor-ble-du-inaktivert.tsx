import { useState } from 'react';
import { BodyShort, ReadMore } from '@navikt/ds-react';

import { useAmplitudeData } from '../hent-initial-data/amplitude-provider';

import { loggAktivitet } from '../../metrics/metrics';

import spacingStyles from '../../spacing.module.css';

function Innhold() {
    return (
        <div className={spacingStyles.mt1}>
            <BodyShort className={spacingStyles.mb1}>
                Du sendte inn ett eller flere meldekort for sent/etter fristen.
            </BodyShort>
            <BodyShort className={spacingStyles.mb1}>
                Du må sende inn meldekortet hver 14. dag for å fortsatt være registrert som arbeidssøker hos NAV.
            </BodyShort>
            <BodyShort className={spacingStyles.mb1}>
                Dersom du lar være å sende inn meldekort hver 14. dag eller sender meldekort etter fristen vil NAV gå ut
                fra at du ikke lenger ønsker å være registrert som arbeidssøker og at du da heller ikke har behov for å
                motta dagpenger, eller tiltakspenger.
            </BodyShort>
            <BodyShort className={spacingStyles.mb1}>
                Husk derfor på å sende inn meldekortene innen fristen hver 14. dag.
            </BodyShort>
        </div>
    );
}

function ReadMoreInaktivering() {
    const { amplitudeData } = useAmplitudeData();
    const [clickedInnsyn, setClickedInnsyn] = useState(false);

    const handleClickOpenReadMoreInaktivering = () => {
        if (!clickedInnsyn) {
            loggAktivitet({ aktivitet: 'Åpner ReadMore om inaktivering', ...amplitudeData });
            setClickedInnsyn(true);
        }
    };

    return (
        <ReadMore
            size="medium"
            header="Hvorfor ble arbeidssøkerperioden min avsluttet?"
            onClick={handleClickOpenReadMoreInaktivering}
        >
            <Innhold />
        </ReadMore>
    );
}

export { ReadMoreInaktivering };
