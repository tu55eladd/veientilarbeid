import * as React from 'react';
import Rad from './rad';
import AapRad from '../komponenter/aap/aap';
import Dialog from '../komponenter/dialog/dialog';
import Banner from '../komponenter/banner/banner';
import Meldekort from '../komponenter/meldekort/meldekort';
import DittSykefravaer from '../komponenter/ditt-sykefravaer/ditt-sykefravaer';
import Dagpenger from '../komponenter/dagpenger/dagpenger';
import Tiltakinfo from '../komponenter/tiltakinfo/tiltakinfo';
import OkonomiRad from '../komponenter/okonomi/okonomi-rad';
import ReaktiveringMelding from '../komponenter/reaktivering-melding';
import Aktivitetsplan from '../komponenter/aktivitetsplan/aktivitetsplan';
import RessurslenkerJobbsok from '../komponenter/ressurslenker-jobbsok/ressurslenker-jobbsok';
import Egenvurdering from '../komponenter/egenvurdering/egenvurdering';
import SjekkOppfolging from '../komponenter/hent-initial-data/sjekk-oppfolging';
import './innhold.less';

interface OwnProps {
    erSykmeldtMedArbeidsgiver: boolean;
    skalViseEgenvurderingLenke: boolean;
    visRessurslenker: boolean;
    skalViseTiltaksinfoLenke: boolean;
}

export default ({erSykmeldtMedArbeidsgiver, skalViseEgenvurderingLenke, visRessurslenker, skalViseTiltaksinfoLenke}: OwnProps) => {
    // TODO Fjerne banner (inkl. brødsmuler)
    return (
        <SjekkOppfolging>
            {erSykmeldtMedArbeidsgiver ? <Banner type="sykmeldt"/> : <Banner type="ordinaer"/>}

            <Rad>
                <ReaktiveringMelding/>
                {skalViseEgenvurderingLenke ? <Egenvurdering/> : null}
                <Aktivitetsplan/>
                <div className="tokol">
                    <Dialog/>
                    {erSykmeldtMedArbeidsgiver ? <DittSykefravaer/> : <Meldekort/>}
                </div>
            </Rad>

            {erSykmeldtMedArbeidsgiver && (
                <Rad><AapRad/></Rad>
            )}

            <Rad>
                {visRessurslenker ? <RessurslenkerJobbsok/> : null}
                {skalViseTiltaksinfoLenke ? <Tiltakinfo/> : null}
            </Rad>

            <Rad>
                {erSykmeldtMedArbeidsgiver ? <OkonomiRad/> : <Dagpenger/>}
            </Rad>
        </SjekkOppfolging>
    );
};
