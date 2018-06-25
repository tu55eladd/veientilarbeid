import * as React from 'react';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Lenkepanel from 'nav-frontend-lenkepanel';

const hvordansokejobber = require('./muligheter-i-arbeidsmarkedet.svg');

export default function MuligheterIArbeidsmarkedet() {
    if (!document.location.href.includes('visMia=true')) {
        return null;
    }
    return (
        <Lenkepanel className="ressurslenke" href="/muligheter-i-arbeidsmarkedet/">
            <img
                src={hvordansokejobber}
                alt="Forstørrelsesglass"
                className="ressurslenke__illustrasjon"
            />
            <div className="ressurslenke__tekst">
                <Systemtittel className="blokk-xs">
                    <FormattedMessage id="mia-overskrift"/>
                </Systemtittel>
                <Element>
                    <FormattedMessage id="mia-beskrivelse"/>
                </Element>
            </div>
        </Lenkepanel>
    );
}