import { BodyLong, BodyShort, Link, ReadMore } from '@navikt/ds-react';

import { saksbehandlingstiderDagpengerUrl } from '../../innhold/lenker';
import Feedback from '../feedback/feedback-profil';
import MeldekortInfo from './meldekort-info';
import DagpengerInfo from './dagpenger-info';
import prettyPrintDato from '../../utils/pretty-print-dato';
import { PermittertSvar } from '../../models/endring-av-situasjon';
import { DinSituasjonSvar } from '../../contexts/brukerregistrering';
import { plussDager } from '../../utils/date-utils';

import spacing from '../../spacing.module.css';
import { dokumentasjon_url } from '../../ducks/urls';

type SituasjonSvar = PermittertSvar | DinSituasjonSvar;

export interface VeiledningsProps {
    valgtSituasjon: SituasjonSvar;
    tilleggsData?: any;
}

export function kreverDokumentasjon(valgtSituasjon: SituasjonSvar): boolean {
    const dokumentasjonsSituasjoner: SituasjonSvar[] = [
        PermittertSvar.TILBAKE_TIL_JOBB,
        PermittertSvar.OPPSIGELSE,
        PermittertSvar.ENDRET_PERMITTERINGSPROSENT,
        PermittertSvar.SAGT_OPP,
        DinSituasjonSvar.ER_PERMITTERT,
    ];
    return dokumentasjonsSituasjoner.includes(valgtSituasjon);
}

const GENERELL_VEILEDNING_MED_DOKUMENTASJON = () => {
    return (
        <>
            <h2 className={spacing.mbn}>Hva betyr endringen for meg?</h2>
            <BodyShort>Vi baserer denne veiledningen på de opplysningene du har oppgitt.</BodyShort>
            <h3 className={spacing.mbn}>Hva må jeg gjøre nå?</h3>
            <BodyShort>
                Du må sende oss dokumentasjon om endringen dersom du ikke har gjort det allerede.
                <br />
                Du kan gå direkte til innsendingen når du lukker dette vinduet.
            </BodyShort>
            <ReadMore header="Hva skjer nå om jeg har søkt eller mottar dagpenger?" className={spacing.mt1}>
                <BodyShort className={spacing.mb1}>
                    Når vi får behandlet dokumentasjonen du sender oss, vil du få et brev om saken din og hva du skal
                    gjøre.
                </BodyShort>
                <BodyShort className={spacing.mb1}>
                    Frem til du mottar dette brevet bør du fortsette å sende inn meldekortene.
                </BodyShort>
                <BodyShort>Du finner informasjon om saksbehandlingstider på NAV.no.</BodyShort>
            </ReadMore>
            <ReadMore header="Skal jeg fortsatt være registrert som arbeidssøker?" className={spacing.mt1}>
                <BodyShort className={spacing.mb1}>
                    Ett av kravene for å få innvilget pengestøtte (dagpenger, tiltakspenger eller kommunal ytelse) er at
                    du må være registrert som arbeidssøker i hele perioden du søker om pengestøtten for.
                </BodyShort>
                <BodyLong>
                    Om du er usikker på når du har rett på pengestøtte, må du derfor huske å sende inn alle meldekortene
                    fremover og å svare 'Ja' på spørsmålet om du ønsker å være registrert som arbeidssøker for de neste
                    14 dagene.
                </BodyLong>
            </ReadMore>
            <Feedback id="endring-veiledning-generell-med-dokumentasjon" />
        </>
    );
};

const GENERELL_VEILEDNING_UTEN_DOKUMENTASJON = () => {
    return (
        <>
            <h2 className={spacing.mbn}>Hva betyr endringen for meg?</h2>
            <BodyShort>Vi baserer denne veiledningen på de opplysningene du har oppgitt.</BodyShort>
            <h3 className={spacing.mbn}>Hva må jeg gjøre nå?</h3>
            <BodyShort>
                Vi har mottatt endringen i din situasjon så du trenger i utgangspunktet ikke gjøre mer rundt denne
                saken.
            </BodyShort>
            <ReadMore header="Skal jeg fortsatt være registrert som arbeidssøker?" className={spacing.mt1}>
                <BodyShort className={spacing.mb1}>
                    Ett av kravene for å få innvilget pengestøtte (dagpenger, tiltakspenger eller kommunal ytelse) er at
                    du må være registrert som arbeidssøker i hele perioden du søker om pengestøtten for.
                </BodyShort>
                <BodyLong>
                    Om du er usikker på når du har rett på pengestøtte, må du derfor huske å sende inn alle meldekortene
                    fremover og å svare 'Ja' på spørsmålet om du ønsker å være registrert som arbeidssøker for de neste
                    14 dagene.
                </BodyLong>
            </ReadMore>
            <Feedback id="endring-veiledning-generell-uten-dokumentasjon" />
        </>
    );
};

const TILBAKE_TIL_JOBB = (props: VeiledningsProps) => {
    const { tilleggsData } = props;

    if (!tilleggsData) return null;

    const { forsteArbeidsdagDato } = tilleggsData;

    return (
        <>
            <h2 className={spacing.mbn}>Hva betyr endringen for meg?</h2>
            <BodyShort>Vi baserer denne veiledningen på de opplysningene du har oppgitt.</BodyShort>
            <h3 className={spacing.mbn}>Hva må jeg gjøre nå?</h3>
            <BodyShort>
                Hvis du har et permitteringsvarsel som du enda ikke har sendt oss, må du gjøre det nå.
            </BodyShort>
            <BodyShort>Du kan gå direkte til innsending når du lukker denne boksen.</BodyShort>
            <ReadMore header="Hva skjer nå om du har søkt eller mottar dagpenger?" className={spacing.mt1}>
                <BodyShort className={spacing.mb1}>
                    Du har oppgitt at du skal tilbake i jobb hos din nåværende arbeidsgiver{' '}
                    {prettyPrintDato(forsteArbeidsdagDato)}.
                </BodyShort>
                <BodyShort className={spacing.mb1}>
                    Frem til {prettyPrintDato(plussDager(forsteArbeidsdagDato, -1).toISOString())} kan du ha rett på
                    dagpenger som permittert arbeidssøker.
                </BodyShort>
                <BodyShort className={spacing.mb1}>Du får et brev om saken din og hva du skal gjøre.</BodyShort>
                <BodyShort>
                    <Link href={saksbehandlingstiderDagpengerUrl}>
                        Du finner informasjon om saksbehandlingstider på NAV.no.
                    </Link>
                </BodyShort>
            </ReadMore>
            <ReadMore header="Skal jeg fortsatt være registrert som arbeidssøker?" className={spacing.mt1}>
                <BodyShort className={spacing.mb1}>
                    For å få dagpenger frem til du begynner i jobb igjen, må du være registrert som arbeidssøker og
                    sende meldekort.
                </BodyShort>
                <BodyLong>
                    Når du er tilbake i jobb og ikke får dagpenger eller ønsker oppfølging fra NAV, kan du svare ‘Nei’
                    på spørsmålet om du ønsker å være registrert som arbeidssøker.
                </BodyLong>
            </ReadMore>
            <Feedback id="endring-veiledning-tilbake-til-jobb" />
        </>
    );
};

const OPPSIGELSE = (props: VeiledningsProps) => {
    const { tilleggsData } = props;

    if (!tilleggsData) return null;

    const { oppsigelseDato } = tilleggsData;

    return (
        <>
            <h2 className={spacing.mbn}>Hva betyr endringen for meg?</h2>
            <BodyShort>Vi baserer denne veiledningen på de opplysningene du har oppgitt.</BodyShort>

            <h3 className={spacing.mbn}>Hva må jeg gjøre nå?</h3>
            <BodyShort>Du må sende oss oppsigelsen du har fått fra arbeidsgiver.</BodyShort>
            <BodyShort>
                Når vi får behandlet dokumentasjonen du sender oss, vil du få et brev om saken din og hva du skal gjøre.
            </BodyShort>
            <BodyShort>Du kan gå direkte til innsending når du lukker denne boksen.</BodyShort>
            <ReadMore header="Hva skjer nå om du har søkt eller mottar dagpenger?" className={spacing.mt1}>
                <BodyShort className={spacing.mb1}>
                    Hvis du var permittert da du ble oppsagt, har du rett til lønn fra arbeidsgiveren din. Du har krav
                    på lønn fra dagen du mottok oppsigelsen og ut oppsigelsestiden.
                </BodyShort>
                <BodyShort className={spacing.mb1}>
                    Du har oppgitt at du mottok oppsigelsen {prettyPrintDato(oppsigelseDato)}.
                </BodyShort>
                <BodyShort>
                    Frem til {prettyPrintDato(oppsigelseDato)} kan du ha rett på dagpenger som permittert arbeidssøker
                </BodyShort>
                <BodyShort>
                    Arbeidsgiver har ansvaret for å betale lønn fra{' '}
                    {prettyPrintDato(plussDager(oppsigelseDato, 1).toISOString())} og ut oppsigelsestiden.
                </BodyShort>
                <BodyShort className={spacing.mb1}>
                    Du bør fortsette å sende inn meldekortene også i oppsigelsestiden.
                </BodyShort>
                <BodyShort>
                    <Link href={saksbehandlingstiderDagpengerUrl}>
                        Du finner informasjon om saksbehandlingstider på NAV.no.
                    </Link>
                </BodyShort>
            </ReadMore>
            <ReadMore header="Skal jeg fortsatt være registrert som arbeidssøker?" className={spacing.mt1}>
                <BodyShort className={spacing.mb1}>
                    Ett av kravene for å få innvilget dagpenger er at du må være registrert som arbeidssøker i hele
                    perioden du søker om pengestøtten for.
                </BodyShort>
                <BodyLong>
                    Om du er usikker på når du har rett på pengestøtte, må du derfor huske å sende inn alle meldekortene
                    fremover og å svare 'Ja' på spørsmålet om du ønsker å være registrert som arbeidssøker for de neste
                    14 dagene.
                </BodyLong>
            </ReadMore>
            <Feedback id="endring-veiledning-oppsigelse" />
        </>
    );
};

const ENDRET_PERMITTERINGSPROSENT = (props: VeiledningsProps) => {
    const { tilleggsData } = props;

    if (!tilleggsData) return null;

    return (
        <>
            <h2 className={spacing.mbn}>Hva betyr endringen for meg?</h2>
            <BodyShort>Vi baserer denne veiledningen på de opplysningene du har oppgitt.</BodyShort>
            <h3 className={spacing.mbn}>Hva må jeg gjøre nå?</h3>
            <BodyShort className={spacing.mb1}>
                Du må sende oss nytt permitteringsvarsel eller annen dokumentasjon fra arbeidsgiver.
            </BodyShort>
            <BodyShort>Du finner knapp for opplasting når du lukker denne boksen.</BodyShort>
            <ReadMore header="Hva skjer nå om du har søkt eller mottar dagpenger?" className={spacing.mt1}>
                <BodyShort className={spacing.mb1}>
                    Når vi har behandlet den nye dokumentasjonen, får du brev om hva du skal gjøre videre.
                </BodyShort>
                <BodyShort className={spacing.mb1}>Du bør fortsette å sende inn meldekortene.</BodyShort>
                <BodyShort className={spacing.mb1}>
                    Du må være permittert i minst 50% av din vanlige arbeidstid for å ha rett på dagpenger som
                    permittert.
                </BodyShort>
                <BodyShort>
                    <Link href={saksbehandlingstiderDagpengerUrl}>
                        Du finner informasjon om saksbehandlingstider på NAV.no.
                    </Link>
                </BodyShort>
            </ReadMore>
            <ReadMore header="Skal jeg fortsatt være registrert som arbeidssøker?" className={spacing.mt1}>
                <BodyShort className={spacing.mb1}>
                    For å få dagpenger må du være registrert som arbeidssøker.
                </BodyShort>
                <BodyLong>
                    Husk at du må sende meldekort og svare 'Ja' på spørsmålet om du ønsker å være registrert som
                    arbeidssøker for de neste 14 dagene.
                </BodyLong>
            </ReadMore>
            <Feedback id="endring-veiledning-endret-permittering" />
        </>
    );
};

const NY_JOBB = (props: VeiledningsProps) => {
    const { tilleggsData } = props;

    if (!tilleggsData) return null;

    return (
        <>
            <h2 className={spacing.mbn}>Hva betyr endringen for meg?</h2>
            <BodyShort>Vi baserer denne veiledningen på de opplysningene du har oppgitt.</BodyShort>
            <h3 className={spacing.mbn}>Hva må jeg gjøre nå?</h3>
            <BodyShort className={spacing.mb1}>Du bør lese mer om jobb i kombinasjon med dagpenger.</BodyShort>
            <ReadMore header="Skal jeg fortsatt være registrert som arbeidssøker?" className={spacing.mt1}>
                <BodyShort className={spacing.mb1}>
                    For å få dagpenger må du være registrert som arbeidssøker.
                </BodyShort>
                <BodyLong>
                    Husk at du må sende meldekort og svare 'Ja' på spørsmålet om du ønsker å være registrert som
                    arbeidssøker for de neste 14 dagene.
                </BodyLong>
            </ReadMore>
            <Feedback id="endring-veiledning-ny-jobb" />
        </>
    );
};

const MIDLERTIDIG_JOBB = (props: VeiledningsProps) => {
    const { tilleggsData } = props;

    if (!tilleggsData) return null;

    return (
        <>
            <h2>Hva betyr dette for meg?</h2>
            <p>
                <h4 className={spacing.mbn}>Dokumentasjon</h4>
                <Link href={dokumentasjon_url}>Du må sende oss den nye arbeidsavtalen</Link>
            </p>
            <p>
                <h4 className={spacing.mbn}>Meldekort</h4>
                <MeldekortInfo {...props} />
            </p>
            <p>
                <h4 className={spacing.mbn}>Dagpenger</h4>
                <DagpengerInfo {...props} />
            </p>
            <p>Gi oss beskjed om noe endrer seg.</p>
            <Feedback id="endring-veiledning-midlertidig-jobb" />
        </>
    );
};

const KONKURS = (props: VeiledningsProps) => {
    const { tilleggsData } = props;

    if (!tilleggsData) return null;

    return (
        <>
            <h2>Hva betyr dette for meg?</h2>
            <p>
                <h4 className={spacing.mbn}>Dokumentasjon</h4>
                <Link href={dokumentasjon_url}>Du må sende oss meldingen om konkursen</Link>
            </p>
            <p>
                <h4 className={spacing.mbn}>Meldekort</h4>
                <MeldekortInfo {...props} />
            </p>
            <p>
                <h4 className={spacing.mbn}>Dagpenger</h4>
                <DagpengerInfo {...props} />
            </p>
            <p>
                Dersom du ønsker dagpenger etter forskuddet må du krysse av for at du også søker dagpenger for etter
                lønnsgarantiperioden er over, så slipper du to dagpengesøknader.
            </p>
            <p>
                <h4 className={spacing.mbn}>Arbeidssøkerregistrering</h4>
                Dersom du fortsatt ønsker å stå registrert som arbeidssøker må du fortsette å sende inn meldekort.
            </p>
            <Feedback id="endring-veiledning-konkurs" />
        </>
    );
};

const SAGT_OPP = (props: VeiledningsProps) => {
    const { tilleggsData } = props;

    if (!tilleggsData) return null;

    return (
        <>
            <h2>Hva betyr dette for meg?</h2>
            <p>
                <h4 className={spacing.mbn}>Meldekort</h4>
                <MeldekortInfo {...props} />
            </p>
            <p>
                <h4 className={spacing.mbn}>Dagpenger</h4>
                <DagpengerInfo {...props} />
            </p>
            <p>
                <h4 className={spacing.mbn}>Arbeidssøkerregistrering</h4>
                Om du ikke lenger vil være registrert som arbeidssøker hos NAV, kan du svare nei på det siste spørsmålet
                i meldekortet.
                <br />
                Før du søker dagpenger på nytt, må du huske å registrere deg igjen.
            </p>
            <Feedback id="endring-veiledning-sagt-opp" />
        </>
    );
};

const ANNET = (props: VeiledningsProps) => {
    return (
        <>
            <h2 className={spacing.mbn}>Hva betyr endringen for meg?</h2>
            <BodyShort>Vi baserer denne veiledningen på de opplysningene du har oppgitt.</BodyShort>
            <h3 className={spacing.mbn}>Hva må jeg gjøre nå?</h3>
            <BodyShort>Skriv til NAV i dialogen og fortell mer om den nye jobbsituasjonen din.</BodyShort>
            <ReadMore header="Skal jeg fortsatt være registrert som arbeidssøker?" className={spacing.mt1}>
                <BodyShort className={spacing.mb1}>
                    Ett av kravene for å få innvilget pengestøtte (dagpenger, tiltakspenger eller kommunal ytelse) er at
                    du må være registrert som arbeidssøker i hele perioden du søker om pengestøtten for.
                </BodyShort>
                <BodyLong>
                    Om du er usikker på når du har rett på pengestøtte, må du derfor huske å sende inn alle meldekortene
                    fremover og å svare 'Ja' på spørsmålet om du ønsker å være registrert som arbeidssøker for de neste
                    14 dagene.
                </BodyLong>
            </ReadMore>
            <Feedback id="endring-veiledning-annet" />
        </>
    );
};

const VIL_BYTTE_JOBB = (props: VeiledningsProps) => {
    return (
        <>
            <BodyShort className={spacing.mb1}>Veiledning for {props.valgtSituasjon}</BodyShort>
            <Feedback id="endring-veiledning-vil-bytte-jobb" />
        </>
    );
};

const Veiledning = (props: VeiledningsProps) => {
    const { valgtSituasjon } = props;

    if (valgtSituasjon === PermittertSvar.OPPSIGELSE) {
        return <OPPSIGELSE {...props} />;
    } else if (valgtSituasjon === PermittertSvar.TILBAKE_TIL_JOBB) {
        return <TILBAKE_TIL_JOBB {...props} />;
    } else if (valgtSituasjon === PermittertSvar.MIDLERTIDIG_JOBB) {
        return <MIDLERTIDIG_JOBB {...props} />;
    } else if (valgtSituasjon === PermittertSvar.KONKURS) {
        return <KONKURS {...props} />;
    } else if (valgtSituasjon === PermittertSvar.NY_JOBB) {
        return <NY_JOBB {...props} />;
    } else if (
        valgtSituasjon === PermittertSvar.ENDRET_PERMITTERINGSPROSENT ||
        valgtSituasjon === DinSituasjonSvar.ER_PERMITTERT
    ) {
        return <ENDRET_PERMITTERINGSPROSENT {...props} />;
    } else if (valgtSituasjon === PermittertSvar.ANNET) {
        return <ANNET {...props} />;
    } else if (valgtSituasjon === PermittertSvar.SAGT_OPP) {
        return <SAGT_OPP {...props} />;
    } else if (valgtSituasjon === DinSituasjonSvar.VIL_BYTTE_JOBB) {
        return <VIL_BYTTE_JOBB {...props} />;
    } else if (kreverDokumentasjon(valgtSituasjon)) {
        return <GENERELL_VEILEDNING_MED_DOKUMENTASJON />;
    } else if (!kreverDokumentasjon(valgtSituasjon)) {
        return <GENERELL_VEILEDNING_UTEN_DOKUMENTASJON />;
    } else {
        return <ANNET {...props} />;
    }
};

export default Veiledning;
