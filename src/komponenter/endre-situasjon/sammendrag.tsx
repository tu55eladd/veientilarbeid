import { BodyLong, BodyShort, Button, Heading, ReadMore } from '@navikt/ds-react';
import { useState } from 'react';

import { useUnderOppfolging } from '../../contexts/arbeidssoker';
import { loggAktivitet } from '../../metrics/metrics';
import { dialogLenke } from '../../innhold/lenker';
import TilleggsData from '../innsyn/tilleggsdata';
import { svarMap } from '../../models/sporsmal-og-svar';
import PermittertModal from './permittert-modal';
import LesIgjenModal from './les-igjen-modal';

import spacing from '../../spacing.module.css';
import spacingStyles from '../../spacing.module.css';
import flexStyles from '../../flex.module.css';

const Sammendrag = (props: any) => {
    const [openEndreModal, setOpenEndreModal] = useState(false);
    const [openLesIgjenModal, setOpenLesIgjenModal] = useState(false);
    const [harLestOmEndringer, setHarLestOmEndringer] = useState<boolean>(false);

    const { amplitudeData, besvarelse, erBesvarelsenEndret } = props;
    const underoppfolging = useUnderOppfolging()?.underoppfolging;
    const kanViseKomponent = underoppfolging;

    const handleDialogClick = () => {
        loggAktivitet({
            aktivitet: 'Går til endre andre opplysninger',
            komponent: 'Min situasjon',
            ...amplitudeData,
        });
    };

    const handleEndreModalOpen = (event: any) => {
        event.preventDefault();
        loggAktivitet({
            aktivitet: 'Åpner modal for å endre jobbsituasjon',
            komponent: 'Min situasjon',
            ...amplitudeData,
        });
        setOpenEndreModal(true);
    };

    const handleLesIgjenModalOpen = (event: any) => {
        event.preventDefault();
        loggAktivitet({
            aktivitet: 'Åpner modal for å lese veiledning igjen',
            komponent: 'Min situasjon',
            ...amplitudeData,
        });
        setOpenLesIgjenModal(true);
    };

    const handleLesOmEndringer = () => {
        if (!harLestOmEndringer) {
            loggAktivitet({
                aktivitet: 'Leser om hvorfor gjøre endringer',
                komponent: 'Min situasjon',
                ...amplitudeData,
            });
            setHarLestOmEndringer(true);
        }
    };

    return !kanViseKomponent ? null : (
        <div className={`${flexStyles.flex} ${flexStyles.flexColumn}`}>
            <div className={spacing.blokkS}>
                <div className={spacing.mb1}>
                    <Heading className={spacingStyles.mb1} size="medium">
                        {besvarelse ? svarMap.dinSituasjon[besvarelse.dinSituasjon.verdi] : 'Min jobbsituasjon: ukjent'}
                    </Heading>
                    <TilleggsData
                        verdi={besvarelse ? besvarelse.dinSituasjon.verdi : null}
                        tilleggsData={besvarelse ? besvarelse.dinSituasjon.tilleggsData : null}
                        visKnapper={true}
                    />
                </div>
                <BodyShort className={`${spacing.mb1} ${spacing.mt1}`}>
                    <Button variant={erBesvarelsenEndret ? 'secondary' : 'primary'} onClick={handleEndreModalOpen}>
                        Jobbsituasjonen min har endret seg
                    </Button>
                </BodyShort>
                <ReadMore
                    header={'Når og hvorfor skal jeg si ifra om endringer?'}
                    className={spacing.mb1}
                    onClick={handleLesOmEndringer}
                >
                    <BodyLong>
                        Hvis det skjer endringer i situasjonen din, kan det påvirke oppfølgingen eller utbetalingen du
                        får fra NAV. Det er derfor viktig å gi beskjed om endringen.
                        <br />
                        Det kan være endringer i din inntekt, familiesituasjon, jobbsituasjon, og så videre.
                    </BodyLong>
                </ReadMore>
                <PermittertModal
                    openModal={openEndreModal}
                    setOpenModal={setOpenEndreModal}
                    besvarelse={besvarelse}
                    amplitudeData={amplitudeData}
                />
                <LesIgjenModal
                    openModal={openLesIgjenModal}
                    setOpenModal={setOpenLesIgjenModal}
                    besvarelse={besvarelse}
                    amplitudeData={amplitudeData}
                />
                <BodyShort>
                    Om andre forhold i situasjonen din har endret seg må du{' '}
                    <a href={dialogLenke} onClick={handleDialogClick}>
                        gi beskjed til NAV
                    </a>
                    .
                </BodyShort>
                {erBesvarelsenEndret && (
                    <BodyShort className={`${spacing.mb1} ${spacing.mt1}`}>
                        <a href={''} onClick={handleLesIgjenModalOpen}>
                            Les om igjen hva denne endringen betyr for deg
                        </a>
                        .
                    </BodyShort>
                )}
            </div>
        </div>
    );
};

export default Sammendrag;
