import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import { AppState } from './reducer';
import { seVeientilarbeid } from './metrics';
import StartsideSykmeldt from './sider/startside-sykmeldt/startside-sykmeldt';
import StartsideOrdinaer from './sider/startside-ordinaer/startside-ordinaer';
import SjekkOppfolging from './komponenter/hent-initial-data/sjekk-oppfolging';
import { selectSykmeldtInfo, State as SykmeldtInfoState } from './ducks/sykmeldt-info';
import { selectServicegruppe, State as ServicegruppeState } from './ducks/servicegruppe';

import './sider/startside.less';

interface StateProps {
    sykmeldtInfo: SykmeldtInfoState;
    servicegruppe: ServicegruppeState;
}

type AllProps = StateProps & RouteComponentProps<any>; // tslint:disable-line

class Routes extends React.Component<AllProps> {

    componentDidMount() {
        const erSykmeldtMedArbeidsgiver = this.props.sykmeldtInfo.data.erSykmeldtMedArbeidsgiver;
        const servicegruppe = this.props.servicegruppe.data.servicegruppe;
        seVeientilarbeid(erSykmeldtMedArbeidsgiver, servicegruppe);
    }

    render() {
        const erSykmeldtMedArbeidsgiver = this.props.sykmeldtInfo.data.erSykmeldtMedArbeidsgiver;
        const { location } = this.props;
        const path = location.pathname;
        const Startside = erSykmeldtMedArbeidsgiver ? StartsideSykmeldt : StartsideOrdinaer;

        return (
            <Switch>
                <Route
                    path={path}
                    exact={true}
                    component={() =>
                        <SjekkOppfolging>
                            <Startside/>
                        </SjekkOppfolging>
                    }
                />
            </Switch>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => ({
    sykmeldtInfo: selectSykmeldtInfo(state),
    servicegruppe: selectServicegruppe(state),
});

export default connect(mapStateToProps, null, null, {pure: false})(withRouter(Routes));
