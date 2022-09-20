import { ReactComponent as BytteIkon } from './bytte-ikon.svg';
import { Link } from '@navikt/ds-react';
import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import { useSprakValg } from '../../contexts/sprak';
import spacingStyles from '../../spacing.module.css';

const TEKSTER: Tekster<string> = {
    nb: {
        aktuelt: 'Dagpenger er mest aktuelt',
        ikkeAktuelt: 'Dagpenger er ikke aktuelt',
    },
    en: {
        aktuelt: 'Unemployment benefits are most relevant',
        ikkeAktuelt: 'Unemployment benefits are not applicable',
    },
};

const ByttVisningLenke = (props: {
    handleByttVisningKlikk: (e: React.MouseEvent) => void;
    valgtYtelserVisning: string;
}) => {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprakValg().sprak);

    return (
        <div className={`flex align-center ${spacingStyles.mt1}`}>
            <BytteIkon className={spacingStyles.mr05} />
            <Link href="" onClick={props.handleByttVisningKlikk}>
                {props.valgtYtelserVisning === 'dagpenger' ? tekst('ikkeAktuelt') : tekst('aktuelt')}
            </Link>
        </div>
    );
};

export default ByttVisningLenke;
