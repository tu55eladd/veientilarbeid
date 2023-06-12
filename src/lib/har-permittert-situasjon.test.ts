import { harPermittertSituasjon } from './har-permittert-situasjon';
import { DinSituasjonSvar } from '../contexts/brukerregistrering';
import { PermittertSvar } from '../models/endring-av-situasjon';

describe('har-permittert-situasjon', () => {
    test('returnerer false for tom input', () => {
        expect(harPermittertSituasjon()).toBe(false);
    });

    test('returnerer true for registrert permittert', () => {
        expect(
            harPermittertSituasjon({
                besvarelse: {
                    dinSituasjon: DinSituasjonSvar.ER_PERMITTERT,
                },
            } as any)
        ).toBe(true);
    });

    test('returnerer true for permittert besvarelse', () => {
        [
            PermittertSvar.ENDRET_PERMITTERINGSPROSENT,
            PermittertSvar.MIDLERTIDIG_JOBB,
            PermittertSvar.TILBAKE_TIL_JOBB,
            PermittertSvar.ANNET,
            PermittertSvar.SAGT_OPP,
        ].forEach((svar) => {
            expect(
                harPermittertSituasjon(undefined, {
                    erBesvarelseEndret: true,
                    besvarelse: {
                        dinSituasjon: {
                            verdi: svar,
                        },
                    } as any,
                })
            ).toBe(true);
        });
    });

    test('returnerer false for ikke-permittert besvarelse', () => {
        expect(
            harPermittertSituasjon(undefined, {
                erBesvarelseEndret: true,
                besvarelse: {
                    dinSituasjon: {
                        verdi: PermittertSvar.OPPSIGELSE,
                    },
                } as any,
            })
        ).toBe(false);
    });
});
