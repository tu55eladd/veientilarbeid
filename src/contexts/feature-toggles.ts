import * as React from 'react';
import { DataElement, STATUS } from '../ducks/api';

export enum FeatureToggles {
    VIS_GJELDER_FRA_DATO = 'veientilarbeid.vis-gjelder-fra-dato',
    BRUK_BEKREFT_REAKTIVERING = 'aia.bruk-bekreft-reaktivering',
    BRUK_SPRAKVELGER = 'aia.bruk-sprakvelger',
    BRUK_VEILEDNING_SKJEMA = 'aia.bruk-veiledning-skjema',
}

export function prettyPrintFeatureToggle(toggle: FeatureToggles) {
    switch (toggle) {
        case FeatureToggles.VIS_GJELDER_FRA_DATO:
            return 'Gjelder fra dato';
        case FeatureToggles.BRUK_BEKREFT_REAKTIVERING:
            return 'Bruk bekreft reaktivering';
        case FeatureToggles.BRUK_SPRAKVELGER:
            return 'Bruk språkvelger';
        case FeatureToggles.BRUK_VEILEDNING_SKJEMA:
            return 'Bruk skjema for veiledning';
    }
}

export interface Data {
    'veientilarbeid.vis-gjelder-fra-dato'?: boolean;
    'aia.bruk-bekreft-reaktivering'?: boolean;
    'aia.bruk-sprakvelger'?: boolean;
    'aia.bruk-veiledning-skjema'?: boolean;
}

export interface State extends DataElement {
    data: Data;
}

export const initialState: State = {
    data: {
        'veientilarbeid.vis-gjelder-fra-dato': false,
        'aia.bruk-bekreft-reaktivering': false,
        'aia.bruk-sprakvelger': false,
        'aia.bruk-veiledning-skjema': false,
    },
    status: STATUS.NOT_STARTED,
};

export const FeaturetoggleContext = React.createContext<State>(initialState);

export const useFeatureToggleData = () => React.useContext(FeaturetoggleContext).data;
