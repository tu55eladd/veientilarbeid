import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, Innholdstittel } from 'nav-frontend-typografi';
import { parse } from 'query-string';
import Lenkepanel from 'nav-frontend-lenkepanel';
import ordinaerAktivitetsplanSvg from './ordinaer-aktivitetsplan.svg';
// import sykmeldingAktivitetsplanSvg from './sykmelding-aktivitetsplan.svg';
import './aktivitetsplan.less';

export const AKTIVITETSPLAN_URL = '/aktivitetsplan/';

interface State {
    nyRegistrering: boolean;
}

interface AktivitetsplanProps {
    erBrukerSykmeldt?: boolean;
}

class Aktivitetsplan extends React.PureComponent<AktivitetsplanProps, State> {
    constructor(props: AktivitetsplanProps) {
        super(props);
        this.state = {
            nyRegistrering: parse(location.search).nyRegistrering === 'true'
        };
    }

    render() {
        const { erBrukerSykmeldt } = this.props;

        let overskriftTekstId = 'aktivitetsplan-overskrift-ordinaer';
        let beskrivelseTekstId;

        if (erBrukerSykmeldt) {
            beskrivelseTekstId = 'aktivitetsplan-beskrivelse-sykmeldt';
        } else {
            beskrivelseTekstId = 'aktivitetsplan-beskrivelse' + (this.state.nyRegistrering ? '-ny' : '');
        }

        return (
            <section className="aktivitetsplan">
                <Lenkepanel tittelProps="undertittel" href={AKTIVITETSPLAN_URL}>
                    <div className="aktivitetsplan__innhold">
                        <div className="aktivitetsplan__illustrasjon">
                            <img
                                src={ordinaerAktivitetsplanSvg}
                                alt="aktivitetsplan-illustrasjon"
                            />
                        </div>
                        <div className="aktivitetsplan__tekst">
                            <Innholdstittel tag="h2" className="informasjonsmodul__heading blokk-s">
                                <FormattedMessage id={overskriftTekstId}/>
                            </Innholdstittel>
                            <Normaltekst className="ingress__tekst">
                                <FormattedMessage id={beskrivelseTekstId}/>
                            </Normaltekst>
                        </div>
                    </div>
                </Lenkepanel>
            </section>
        );
    }
}

export default Aktivitetsplan;
