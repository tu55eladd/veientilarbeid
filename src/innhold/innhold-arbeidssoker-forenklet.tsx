import { useFeatureToggleData } from '../contexts/feature-toggles';
import { useReaktivering } from '../contexts/reaktivering';

import InnholdMetrics from './innhold-metrics';
import RegistrertTittel from '../komponenter/registrert-tittel/registrert-tittel';
import ReaktiveringKvittering from '../komponenter/reaktivering/reaktivering-kvittering';
import ForenkletInnhold from '../komponenter/ikke-standard/forenklet-innhold';
import Motestotte from '../komponenter/ikke-standard/motestotte';
import { AutomatiskReaktivert } from '../komponenter/reaktivering/automatisk-reaktivert';
import { visAutomatiskReaktiveringsKort } from '../lib/vis-automatisk-reaktiverings-kort';
import MinSituasjon from '../komponenter/min-situasjon/min-situasjon';

import styles from './innhold.module.css';

const InnholdView = () => {
    const featureToggleData = useFeatureToggleData();
    const { reaktivering } = useReaktivering();

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
                        <ForenkletInnhold />
                        <Motestotte />
                    </>
                )}
            </div>
        </>
    );
};

export default InnholdView;
