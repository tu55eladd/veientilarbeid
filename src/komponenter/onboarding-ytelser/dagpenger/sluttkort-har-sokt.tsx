import { BodyShort, Heading, Link } from '@navikt/ds-react';
import { useAmplitudeData } from '../../../contexts/amplitude-context';
import { useDpInnsynSoknadData } from '../../../contexts/dp-innsyn-soknad';
import { sorterEtterNyesteDatoInnsendt } from '../../../lib/beregn-dagpenge-status';
import { loggAktivitet } from '../../../metrics/metrics';
import { mine_dagpenger_url } from '../../../url';
import SistInnsendtSoknad from './sist-innsendt-soknad';
import { usePaabegynteSoknaderData } from '../../../contexts/paabegynte-soknader';
import PaabegynteSoknader from './paabegynte-soknader';
import SkrivTilOssOgChat from './skriv-til-oss-og-chat';
import LesOmYtelser from './les-om-ytelser';

const Sluttkort = () => {
    const amplitudeData = useAmplitudeData();

    const soknader = useDpInnsynSoknadData();
    const sisteInnsendteSoknad = soknader?.sort(sorterEtterNyesteDatoInnsendt)[0];
    const paabegynteSoknader = usePaabegynteSoknaderData().soknader;
    const sistePaabegyntSoknad = paabegynteSoknader.sort(
        (a, b) => new Date(b.dato).getTime() - new Date(a.dato).getTime()
    )[0];
    const harPaabegyntEtterInnsendt =
        sistePaabegyntSoknad &&
        new Date(sistePaabegyntSoknad.dato).getTime() > new Date(sisteInnsendteSoknad?.datoInnsendt).getTime();

    function loggLenkeKlikk(action: string, url: string) {
        loggAktivitet({ aktivitet: action, ...amplitudeData });
        window.location.assign(url);
    }

    return (
        <>
            <Heading size="medium" className={'blokk-xs'}>
                {harPaabegyntEtterInnsendt ? 'Søknad om dagpenger og påbegynte søknader' : 'Søknad om dagpenger'}
            </Heading>
            <SistInnsendtSoknad dato={sisteInnsendteSoknad?.datoInnsendt} komponent="sokt" />

            <BodyShort className={'blokk-xs'}>
                Du kan ettersende dokumentasjon og se mer informasjon via {' '}
                <Link
                    className={'tracking-wide'}
                    href={mine_dagpenger_url}
                    onClick={() =>
                        loggLenkeKlikk(
                            'Går til Mine dagpenger fra "dagpenger-tema - har søkt dagpenger"',
                            mine_dagpenger_url
                        )
                    }
                >
                    Mine dagpenger
                </Link>
            </BodyShort>

            <PaabegynteSoknader dato={sisteInnsendteSoknad?.datoInnsendt} komponent="sokt" />

            <SkrivTilOssOgChat amplitudeTemaNavn='"dagpenger-tema - har søkt dagpenger"' />
            <LesOmYtelser amplitudeTemaNavn={'dagpenger-tema - har søkt dagpenger'} />
        </>
    );
};

export default Sluttkort;
