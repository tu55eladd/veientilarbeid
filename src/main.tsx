import React from 'react';

import Innholdslaster from './komponenter/innholdslaster/innholdslaster';
import * as Autentisering from './contexts/autentisering';
import Feilmelding from './komponenter/feilmeldinger/feilmelding';
import { fetchData } from './ducks/api-utils';
import { ARBEIDSSOKER_NIVA3_URL, AUTH_API, FEATURE_URL } from './ducks/api';
import Innhold from './innhold/innhold';

import './index.css';
import * as Arbeidssoker from './contexts/arbeidssoker';
import * as FeatureToggle from './contexts/feature-toggles';
import * as SprakValg from './contexts/sprak';

const Mikrofrontend = () => {
    const [state, setState] = React.useState<Autentisering.State>(Autentisering.initialState);
    const [arbeidssokerState, setArbeidssokerState] = React.useState<Arbeidssoker.State>(Arbeidssoker.initialState);
    const [featureToggleState, setFeatureToggleState] = React.useState<FeatureToggle.State>(FeatureToggle.initialState);
    const [valgtSprak, setValgtSprak] = React.useState<SprakValg.State>(SprakValg.initialState);

    const parameters = Object.values(FeatureToggle.FeatureToggles)
        .map((element) => 'feature=' + element)
        .join('&');
    const featureTogglesUrl = `${FEATURE_URL}?${parameters}`;

    React.useEffect(() => {
        fetchData<Autentisering.State, Autentisering.Data>(state, setState, AUTH_API);
        fetchData<Arbeidssoker.State, Arbeidssoker.Data>(
            arbeidssokerState,
            setArbeidssokerState,
            ARBEIDSSOKER_NIVA3_URL
        );
        fetchData<FeatureToggle.State, FeatureToggle.Data>(
            featureToggleState,
            setFeatureToggleState,
            featureTogglesUrl
        );
        setValgtSprak(SprakValg.hentSprakValgFraUrl());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Innholdslaster
            feilmeldingKomponent={<Feilmelding />}
            storrelse="XXL"
            avhengigheter={[state, arbeidssokerState, featureToggleState]}
        >
            <Autentisering.AutentiseringContext.Provider value={state}>
                <Arbeidssoker.ArbeidssokerContext.Provider value={arbeidssokerState}>
                    <FeatureToggle.FeaturetoggleContext.Provider value={featureToggleState}>
                        <SprakValg.SprakContext.Provider value={valgtSprak}>
                            <Innhold />
                        </SprakValg.SprakContext.Provider>
                    </FeatureToggle.FeaturetoggleContext.Provider>
                </Arbeidssoker.ArbeidssokerContext.Provider>
            </Autentisering.AutentiseringContext.Provider>
        </Innholdslaster>
    );
};

export default Mikrofrontend;
