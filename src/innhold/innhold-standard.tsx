import { useArbeidssokerPerioder } from '../contexts/arbeidssoker';
import { useFeatureToggleData } from '../contexts/feature-toggles';
import { useReaktivering } from '../contexts/reaktivering';
import { useBehovForVeiledning } from '../contexts/behov-for-veiledning';

import InnholdMetrics from './innhold-metrics';
import RegistrertTittel from '../komponenter/registrert-tittel/registrert-tittel';
import MinSituasjon from '../komponenter/min-situasjon/min-situasjon';
import ReaktiveringKvittering from '../komponenter/reaktivering/reaktivering-kvittering';
import GjelderFraDato from '../komponenter/gjelder-fra-dato/GjelderFraDato';
import DagpengerOgYtelser from '../komponenter/dagpenger/dagpenger-og-ytelser';
import Meldekort from '../komponenter/meldekort/meldekort';
import HjelpOgStotte from '../komponenter/hjelp-og-stotte/hjelp-og-stotte';
import Aktivitetsplan from '../komponenter/aktivitetsplan/aktivitetsplan';
import Behovsavklaring from '../komponenter/behovsavklaring-oppfolging/behovsavklaring-oppfolging';
import beregnArbeidssokerperioder from '../lib/beregn-arbeidssokerperioder';
import { AutomatiskReaktivert } from '../komponenter/reaktivering/automatisk-reaktivert';
import { visAutomatiskReaktiveringsKort } from '../lib/vis-automatisk-reaktiverings-kort';

import styles from './innhold.module.css';

const InnholdStandard = () => {
    const arbeidssokerperioderData = useArbeidssokerPerioder();
    const featureToggleData = useFeatureToggleData();
    const { reaktivering } = useReaktivering();
    const behov = useBehovForVeiledning();

    const { behovForVeiledning } = behov;
    const { harAktivArbeidssokerperiode, aktivPeriodeStart } = beregnArbeidssokerperioder(arbeidssokerperioderData);
    const harSistSvartDato = behovForVeiledning && behovForVeiledning.dato ? new Date(behovForVeiledning.dato) : null;
    const harPeriodeStart = harAktivArbeidssokerperiode === 'Ja' ? new Date(aktivPeriodeStart) : null;

    const harGyldigBehovsvurdering = harSistSvartDato && harPeriodeStart && harSistSvartDato > harPeriodeStart;

    const skalViseReaktiveringsKort = visAutomatiskReaktiveringsKort(featureToggleData, reaktivering);

    return (
        <>
            <InnholdMetrics />
            <div className={styles.limit}>
                {skalViseReaktiveringsKort ? (
                    <AutomatiskReaktivert />
                ) : (
                    <>
                        <ReaktiveringKvittering />
                        <RegistrertTittel />
                        <MinSituasjon />
                        {harGyldigBehovsvurdering ? <HjelpOgStotte /> : <Behovsavklaring />}
                        <DagpengerOgYtelser />
                        <Meldekort />
                        {harGyldigBehovsvurdering ? <Aktivitetsplan /> : null}
                        <GjelderFraDato />
                    </>
                )}
            </div>
        </>
    );
};

export default InnholdStandard;
