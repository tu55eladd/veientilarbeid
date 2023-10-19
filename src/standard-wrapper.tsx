import flex from './flex.module.css';
import AiaTabs from './tabs/aia-tabs';
import InnholdStandard from './innhold/innhold-standard';
import { useWindowInnerWidth } from './contexts/window-inner-width';

const MIN_TABS_BREDDE = 666;
function StandardWrapper() {
    const { innerWidth } = useWindowInnerWidth();

    const brukTabs = innerWidth > MIN_TABS_BREDDE;

    return <div className={`${flex.flex} ${flex.center}`}>{brukTabs ? <AiaTabs /> : <InnholdStandard />}</div>;
}

export default StandardWrapper;
