import {
    Alert,
    BodyShort,
    Button,
    Heading,
    HelpText,
    Link,
    Modal,
    Radio,
    RadioGroup,
    Select,
    UNSAFE_DatePicker,
    UNSAFE_useDatepicker,
} from '@navikt/ds-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import spacing from '../../spacing.module.css';
import flex from '../../flex.module.css';
import React, { useEffect, useState } from 'react';
import { loggAktivitet } from '../../metrics/metrics';
import prettyPrintDato from '../../utils/pretty-print-dato';
import { BesvarelseRequest, useBesvarelse } from '../../contexts/besvarelse';
import { DinSituasjonSvar } from '../../contexts/brukerregistrering';

enum PermittertSvar {
    OPPSIGELSE = 'OPPSIGELSE',
    ENDRET_PERMITTERINGSPROSENT = 'ENDRET_PERMITTERINGSPROSENT',
    TILBAKE_TIL_JOBB = 'TILBAKE_TIL_JOBB',
    NY_JOBB = 'NY_JOBB',
    MIDLERTIDIG_JOBB = 'MIDLERTIDIG_JOBB',
    UAVKLART = 'UAVKLART',
    ANNET = 'ANNET',
}

const permittertTekster = {
    [PermittertSvar.OPPSIGELSE]: 'Jeg har fått oppsigelse',
    [PermittertSvar.ENDRET_PERMITTERINGSPROSENT]: 'Permitteringsprosenten har endret seg',
    [PermittertSvar.TILBAKE_TIL_JOBB]: 'Skal tilbake til jobben',
    [PermittertSvar.NY_JOBB]: 'Jeg har fått meg ny jobb',
    [PermittertSvar.MIDLERTIDIG_JOBB]: 'Jeg har fått midlertidig jobb',
    [PermittertSvar.UAVKLART]: 'Arbeidssituasjonen min er uavklart',
    [PermittertSvar.ANNET]: 'Annet',
};

interface PermittertModalProps {
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    amplitudeData: any;
    besvarelse: any | null; //BesvarelseResponse['besvarelse'] | null;
}

interface Steg1Props {
    valgtSituasjon: PermittertSvar;
    settValgtSituasjon: React.Dispatch<React.SetStateAction<PermittertSvar>>;
    onClick: () => void;
}

interface Steg2Props {
    valgtSituasjon: PermittertSvar;
    settValgtSituasjon: React.Dispatch<React.SetStateAction<PermittertSvar>>;
    settDatoer: React.Dispatch<React.SetStateAction<any>>;
    onClick: () => void;
    amplitudeData: any;
}

interface Steg3Props {
    valgtSituasjon: PermittertSvar;
    datoer?: any;
    onClose(): void;
}

const OPPSIGELSE = (props: Steg2Props) => {
    const {
        datepickerProps: oppsigelseProps,
        inputProps: oppsigelseInput,
        selectedDay: oppsigelseDato,
    } = UNSAFE_useDatepicker({
        fromDate: new Date('Jan 01 2022'),
        defaultSelected: new Date(),
    });

    const {
        datepickerProps: sisteArbeidsdagProps,
        inputProps: sisteArbeidsdagInput,
        selectedDay: sisteArbeidsdagDato,
    } = UNSAFE_useDatepicker({
        fromDate: new Date('Jan 01 2022'),
        defaultSelected: new Date(),
    });

    const { lagreBesvarelse } = useBesvarelse();
    const { amplitudeData, valgtSituasjon, onClick, settDatoer } = props;
    const handleLagreEndringer = async () => {
        loggAktivitet({
            aktivitet: 'Lagrer endring i jobbsituasjonen',
            komponent: 'Min situasjon',
            ...amplitudeData,
        });
        console.log('valgtSituasjon', valgtSituasjon);
        const payload = {
            tekst: 'Jobbsitiasjonen er oppdatert til noe. Endringene gjelder fra en dato',
            overskrift: 'Jobbsituasjonen min er endret',
            venterPaaSvarFraNav: true,
            oppdatering: {
                besvarelse: {
                    dinSituasjon: {
                        verdi: DinSituasjonSvar.ER_PERMITTERT,
                        tilleggsData: {
                            oppsigelseDato,
                            sisteArbeidsdagDato,
                        },
                    },
                },
            },
        } as BesvarelseRequest;
        await lagreBesvarelse(payload);
        settDatoer({
            oppsigelseDato,
            sisteArbeidsdagDato,
        });
        onClick();
    };

    return (
        <>
            <UNSAFE_DatePicker {...oppsigelseProps} strategy="fixed">
                <UNSAFE_DatePicker.Input
                    {...oppsigelseInput}
                    className={spacing.mb1}
                    label={
                        <div className={flex.flex}>
                            Når mottok du oppsigelsen?
                            <HelpText className={spacing.ml05}>
                                Datoen da du mottok beskjed fra arbeidsgiver om at du mistet jobben.
                            </HelpText>
                        </div>
                    }
                />
            </UNSAFE_DatePicker>

            <UNSAFE_DatePicker {...sisteArbeidsdagProps} strategy="fixed">
                <UNSAFE_DatePicker.Input
                    {...sisteArbeidsdagInput}
                    className={spacing.mb1}
                    label={
                        <div className={flex.flex}>
                            Når er din siste arbeidsdag der arbeidsgiver betaler lønn?
                            <HelpText className={spacing.ml05}>
                                Når oppsigelsestiden er over og du ikke lenger mottar lønn fra arbeidsgiver kan du på
                                nytt søke dagpenger dersom du ikke har fått nytt arbeid.
                            </HelpText>
                        </div>
                    }
                />
            </UNSAFE_DatePicker>
            <BodyShort className={spacing.mb1}>
                NAV bruker opplysningene til å vurdere hvor mye veiledning du trenger.
            </BodyShort>
            <div className={`${flex.flex} ${flex.flexEnd}`}>
                <Button variant={'primary'} onClick={handleLagreEndringer}>
                    Lagre endring i situasjon
                </Button>
            </div>
        </>
    );
};

const ENDRET = (props: Steg2Props) => {
    const {
        datepickerProps: gjelderFraDatoProps,
        inputProps: gjelderFraDatoInput,
        selectedDay: gjelderFraDatoDato,
    } = UNSAFE_useDatepicker({
        fromDate: new Date('Jan 01 2022'),
        defaultSelected: new Date(),
    });

    // const { lagreBesvarelse } = useBesvarelse();
    const { amplitudeData, valgtSituasjon, onClick } = props;

    const handleChange = (val: any) => console.log(val);

    const handleLagreEndringer = async () => {
        loggAktivitet({
            aktivitet: 'Lagrer endring i jobbsituasjonen',
            komponent: 'Min situasjon',
            ...amplitudeData,
        });
        console.log('valgtSituasjon: ', valgtSituasjon);
        console.log('oppsigelseDato: ', gjelderFraDatoDato);
        onClick();
    };

    return (
        <>
            <UNSAFE_DatePicker {...gjelderFraDatoProps} strategy="fixed">
                <UNSAFE_DatePicker.Input
                    {...gjelderFraDatoInput}
                    className={spacing.mb1}
                    label="Fra hvilken dato skjer endringen?"
                />
            </UNSAFE_DatePicker>

            <RadioGroup legend="Hva er den nye peritteringsprosenten?" onChange={(val: any) => handleChange(val)}>
                <Radio value="100">100 prosent</Radio>
                <Radio value="75">75 prosent</Radio>
                <Radio value="50">50 prosent</Radio>
                <Radio value="25">25 prosent</Radio>
            </RadioGroup>

            <BodyShort className={spacing.mb1}>
                NAV bruker opplysningene til å vurdere hvor mye veiledning du trenger.
            </BodyShort>
            <div className={`${flex.flex} ${flex.flexEnd}`}>
                <Button variant={'primary'} onClick={handleLagreEndringer}>
                    Lagre endring i situasjon
                </Button>
            </div>
        </>
    );
};

const TILBAKE_TIL_JOBB = (props: Steg2Props) => {
    const {
        datepickerProps: forsteArbeidsdagProps,
        inputProps: forsteArbeidsdagInput,
        selectedDay: forsteArbeidsdagDato,
    } = UNSAFE_useDatepicker({
        fromDate: new Date('Jan 01 2022'),
        defaultSelected: new Date(),
    });

    // const { lagreBesvarelse } = useBesvarelse();
    const { amplitudeData, valgtSituasjon, onClick } = props;
    const handleLagreEndringer = async () => {
        loggAktivitet({
            aktivitet: 'Lagrer endring i jobbsituasjonen',
            komponent: 'Min situasjon',
            ...amplitudeData,
        });
        console.log('valgtSituasjon: ', valgtSituasjon);
        console.log('oppsigelseDato: ', forsteArbeidsdagDato);
        onClick();
    };

    return (
        <>
            <UNSAFE_DatePicker {...forsteArbeidsdagProps} strategy="fixed">
                <UNSAFE_DatePicker.Input
                    {...forsteArbeidsdagInput}
                    className={spacing.mb1}
                    label="Når er første arbeidsdag etter permittering?"
                />
            </UNSAFE_DatePicker>

            <BodyShort className={spacing.mb1}>
                NAV bruker opplysningene til å vurdere hvor mye veiledning du trenger.
            </BodyShort>
            <div className={`${flex.flex} ${flex.flexEnd}`}>
                <Button variant={'primary'} onClick={handleLagreEndringer}>
                    Lagre endring i situasjon
                </Button>
            </div>
        </>
    );
};

const NY_JOBB = (props: Steg2Props) => {
    const {
        datepickerProps: forsteArbeidsdagProps,
        inputProps: forsteArbeidsdagInput,
        selectedDay: forsteArbeidsdagDato,
    } = UNSAFE_useDatepicker({
        fromDate: new Date('Jan 01 2022'),
        defaultSelected: new Date(),
    });

    const {
        datepickerProps: sisteArbeidsdagProps,
        inputProps: sisteArbeidsdagInput,
        selectedDay: sisteArbeidsdagDato,
    } = UNSAFE_useDatepicker({
        fromDate: new Date('Jan 01 2022'),
        defaultSelected: new Date(),
    });

    // const { lagreBesvarelse } = useBesvarelse();
    const { amplitudeData, valgtSituasjon, onClick } = props;
    const handleLagreEndringer = async () => {
        loggAktivitet({
            aktivitet: 'Lagrer endring i jobbsituasjonen',
            komponent: 'Min situasjon',
            ...amplitudeData,
        });
        console.log('valgtSituasjon: ', valgtSituasjon);
        console.log('oppsigelseDato: ', forsteArbeidsdagDato);
        console.log('sisteArbeidsdagDato: ', sisteArbeidsdagDato);
        onClick();
    };

    return (
        <>
            <UNSAFE_DatePicker {...forsteArbeidsdagProps} strategy="fixed">
                <UNSAFE_DatePicker.Input
                    {...forsteArbeidsdagInput}
                    className={spacing.mb1}
                    label="Når er første arbeidsdag i ny jobb?"
                />
            </UNSAFE_DatePicker>

            <UNSAFE_DatePicker {...sisteArbeidsdagProps} strategy="fixed">
                <UNSAFE_DatePicker.Input
                    {...sisteArbeidsdagInput}
                    className={spacing.mb1}
                    label="Når er siste arbeidsdag med lønn i nåværende jobb?"
                />
            </UNSAFE_DatePicker>
            <BodyShort className={spacing.mb1}>
                NAV bruker opplysningene til å vurdere hvor mye veiledning du trenger.
            </BodyShort>
            <div className={`${flex.flex} ${flex.flexEnd}`}>
                <Button variant={'primary'} onClick={handleLagreEndringer}>
                    Lagre endring i situasjon
                </Button>
            </div>
        </>
    );
};

const MIDLERTIDIG_JOBB = (props: Steg2Props) => {
    const {
        datepickerProps: forsteArbeidsdagProps,
        inputProps: forsteArbeidsdagInput,
        selectedDay: forsteArbeidsdagDato,
    } = UNSAFE_useDatepicker({
        fromDate: new Date('Jan 01 2022'),
        defaultSelected: new Date(),
    });

    const {
        datepickerProps: sisteArbeidsdagProps,
        inputProps: sisteArbeidsdagInput,
        selectedDay: sisteArbeidsdagDato,
    } = UNSAFE_useDatepicker({
        fromDate: new Date('Jan 01 2022'),
        defaultSelected: new Date(),
    });

    // const { lagreBesvarelse } = useBesvarelse();
    const { amplitudeData, valgtSituasjon, onClick } = props;
    const handleLagreEndringer = async () => {
        loggAktivitet({
            aktivitet: 'Lagrer endring i jobbsituasjonen',
            komponent: 'Min situasjon',
            ...amplitudeData,
        });
        console.log('valgtSituasjon: ', valgtSituasjon);
        console.log('oppsigelseDato: ', forsteArbeidsdagDato);
        console.log('sisteArbeidsdagDato: ', sisteArbeidsdagDato);
        onClick();
    };

    return (
        <>
            <UNSAFE_DatePicker {...forsteArbeidsdagProps} strategy="fixed">
                <UNSAFE_DatePicker.Input
                    {...forsteArbeidsdagInput}
                    className={spacing.mb1}
                    label="Når er første arbeidsdag?"
                />
            </UNSAFE_DatePicker>

            <UNSAFE_DatePicker {...sisteArbeidsdagProps} strategy="fixed">
                <UNSAFE_DatePicker.Input
                    {...sisteArbeidsdagInput}
                    className={spacing.mb1}
                    label="Når er siste arbeidsdag?"
                />
            </UNSAFE_DatePicker>
            <BodyShort className={spacing.mb1}>
                NAV bruker opplysningene til å vurdere hvor mye veiledning du trenger.
            </BodyShort>
            <div className={`${flex.flex} ${flex.flexEnd}`}>
                <Button variant={'primary'} onClick={handleLagreEndringer}>
                    Lagre endring i situasjon
                </Button>
            </div>
        </>
    );
};

const UAVKLART = (props: Steg2Props) => {
    const { amplitudeData, valgtSituasjon, settValgtSituasjon, onClick } = props;
    const handleLagreEndringer = async () => {
        loggAktivitet({
            aktivitet: 'Lagrer endring i jobbsituasjonen',
            komponent: 'Min situasjon',
            ...amplitudeData,
        });
        console.log('valgtSituasjon: ', valgtSituasjon);
        onClick();
    };
    return (
        <>
            <BodyShort className={spacing.mb1}>Du har sagt at situasjonen din er "uavklart". Fortell mer.</BodyShort>
            <Select
                className={spacing.mb1}
                label={'Velg den nye situasjonen som passer deg best'}
                onChange={(e) => settValgtSituasjon(e.target.value as PermittertSvar)}
                value={valgtSituasjon}
            >
                {Object.keys(permittertTekster).map((situasjon) => (
                    <option key={situasjon} value={situasjon}>
                        {permittertTekster[situasjon]}
                    </option>
                ))}
            </Select>
            <BodyShort className={spacing.mb1}>
                NAV bruker opplysningene til å vurdere hvor mye veiledning du trenger.
            </BodyShort>
            <div className={`${flex.flex} ${flex.flexEnd}`}>
                <Button variant={'primary'} onClick={handleLagreEndringer}>
                    Lagre endring i situasjon
                </Button>
            </div>
        </>
    );
};

const ANNET = (props: Steg2Props) => {
    const { amplitudeData, valgtSituasjon, settValgtSituasjon, onClick } = props;
    const handleLagreEndringer = async () => {
        loggAktivitet({
            aktivitet: 'Lagrer endring i jobbsituasjonen',
            komponent: 'Min situasjon',
            ...amplitudeData,
        });
        console.log('valgtSituasjon: ', valgtSituasjon);
        onClick();
    };

    return (
        <>
            <BodyShort className={spacing.mb1}>Du har sagt at situasjonen din er "annet". Fortell mer.</BodyShort>
            <Select
                className={spacing.mb1}
                label={'Velg den nye situasjonen som passer deg best'}
                onChange={(e) => settValgtSituasjon(e.target.value as PermittertSvar)}
                value={valgtSituasjon}
            >
                {Object.keys(permittertTekster).map((situasjon) => (
                    <option key={situasjon} value={situasjon}>
                        {permittertTekster[situasjon]}
                    </option>
                ))}
            </Select>
            <BodyShort className={spacing.mb1}>
                NAV bruker opplysningene til å vurdere hvor mye veiledning du trenger.
            </BodyShort>
            <div className={`${flex.flex} ${flex.flexEnd}`}>
                <Button variant={'primary'} onClick={handleLagreEndringer}>
                    Lagre endring i situasjon
                </Button>
            </div>
        </>
    );
};

const Steg1 = (props: Steg1Props) => {
    const { valgtSituasjon, settValgtSituasjon, onClick } = props;
    return (
        <>
            <Select
                className={spacing.mb1}
                label={'Velg den nye situasjonen som passer deg best'}
                onChange={(e) => settValgtSituasjon(e.target.value as PermittertSvar)}
                value={valgtSituasjon}
            >
                {Object.keys(permittertTekster).map((situasjon) => (
                    <option key={situasjon} value={situasjon}>
                        {permittertTekster[situasjon]}
                    </option>
                ))}
            </Select>
            <div className={`${flex.flex} ${flex.flexEnd}`}>
                <Button variant={'primary'} onClick={onClick}>
                    Neste
                </Button>
            </div>
        </>
    );
};

const Steg2 = (props: Steg2Props) => {
    const { valgtSituasjon } = props;
    if (valgtSituasjon === PermittertSvar.OPPSIGELSE) {
        return <OPPSIGELSE {...props} />;
    } else if (valgtSituasjon === PermittertSvar.TILBAKE_TIL_JOBB) {
        return <TILBAKE_TIL_JOBB {...props} />;
    } else if (valgtSituasjon === PermittertSvar.MIDLERTIDIG_JOBB) {
        return <MIDLERTIDIG_JOBB {...props} />;
    } else if (valgtSituasjon === PermittertSvar.NY_JOBB) {
        return <NY_JOBB {...props} />;
    } else if (valgtSituasjon === PermittertSvar.ENDRET_PERMITTERINGSPROSENT) {
        return <ENDRET {...props} />;
    } else if (valgtSituasjon === PermittertSvar.ANNET) {
        return <ANNET {...props} />;
    } else if (valgtSituasjon === PermittertSvar.UAVKLART) {
        return <UAVKLART {...props} />;
    } else {
        return <ANNET {...props} />;
    }
};

const OppsigelseKvittering = (props: Steg3Props) => {
    const { datoer } = props;
    return (
        <ul>
            <li>Du har oppgitt at du mottok oppsigelsen {prettyPrintDato(datoer.oppsigelseDato)}</li>
            <li>Din arbeidsgiver betaler lønn til og med {prettyPrintDato(datoer.sisteArbeidsdagDato)}</li>
        </ul>
    );
};

const Steg3 = (props: Steg3Props) => {
    const { valgtSituasjon, onClose } = props;
    const Kvittering = () => {
        if (valgtSituasjon === PermittertSvar.OPPSIGELSE) {
            return <OppsigelseKvittering {...props} />;
        }

        return null;
    };
    return (
        <>
            <Alert variant="info">NAV har mottatt oppdateringen.</Alert>
            <Kvittering />
            <div className={`${flex.flex} ${flex.flexEnd}`}>
                <Button variant={'primary'} onClick={onClose}>
                    Lukk
                </Button>
            </div>
        </>
    );
};

const PermittertModal = (props: PermittertModalProps) => {
    const { openModal, setOpenModal, amplitudeData } = props;
    const [aktivSide, settAktivSide] = React.useState<number>(1);
    const [valgtSituasjon, settValgtSituasjon] = useState<PermittertSvar>(PermittertSvar.OPPSIGELSE);
    const [datoer, settDatoer] = useState<any>(null);

    useEffect(() => {
        settAktivSide(1);
    }, [openModal]);

    const Innhold = () => {
        if (aktivSide === 1) {
            return (
                <Steg1
                    valgtSituasjon={valgtSituasjon}
                    settValgtSituasjon={settValgtSituasjon}
                    onClick={() => settAktivSide(2)}
                />
            );
        }

        if (aktivSide === 2) {
            return (
                <Steg2
                    valgtSituasjon={valgtSituasjon}
                    amplitudeData={amplitudeData}
                    settValgtSituasjon={settValgtSituasjon}
                    settDatoer={settDatoer}
                    onClick={() => settAktivSide(3)}
                />
            );
        }

        if (aktivSide === 3) {
            return <Steg3 valgtSituasjon={valgtSituasjon} datoer={datoer} onClose={() => setOpenModal(false)} />;
        }

        return null;
    };

    const Tilbake = () => {
        if (aktivSide !== 2) {
            return null;
        }
        // eslint-disable-next-line react/jsx-no-undef
        return (
            <Link href={'#'} onClick={() => settAktivSide(aktivSide - 1)}>
                <ChevronLeftIcon /> Tilbake
            </Link>
        );
    };

    return (
        <Modal
            open={openModal}
            aria-label="Jobbsituasjonen min har endret seg"
            onClose={() => setOpenModal((x) => !x)}
            // shouldCloseOnEsc={!datepickerProps.open}
            aria-labelledby="modal-heading"
        >
            <Modal.Content>
                <Tilbake />
                <Heading spacing level="1" size="large" id="modal-heading">
                    Min jobbsituasjonen har endret seg
                </Heading>
                <Heading level="2" size="medium">
                    Fortell oss hva som har endret seg slik at vi kan veilede deg videre
                </Heading>
                <BodyShort className={spacing.mb1}>Steg {aktivSide} / 3</BodyShort>
                <Innhold />
            </Modal.Content>
        </Modal>
    );
};

export default PermittertModal;
