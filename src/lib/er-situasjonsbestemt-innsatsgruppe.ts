import { Brukerregistrering } from '../context/brukerregistrering';
import { Data as OppfolgingData } from '../ducks/oppfolging';

interface DataGrunnlag {
    brukerregistreringData: Brukerregistrering | null;
    oppfolgingData: OppfolgingData;
}

function sjekkOmBrukerErSituasjonsbestemtInnsatsgruppe(data: DataGrunnlag): boolean {
    const { brukerregistreringData, oppfolgingData } = data;
    const foreslattInnsatsgruppe = brukerregistreringData?.profilering?.innsatsgruppe;
    const { servicegruppe, formidlingsgruppe } = oppfolgingData;

    if (servicegruppe === 'BFORM' && formidlingsgruppe === 'ARBS') return true;
    if (
        servicegruppe === 'IVURD' &&
        formidlingsgruppe === 'ARBS' &&
        foreslattInnsatsgruppe === 'SITUASJONSBESTEMT_INNSATS'
    )
        return true;
    return false;
}

export default sjekkOmBrukerErSituasjonsbestemtInnsatsgruppe;
