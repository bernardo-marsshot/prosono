import { apiService } from './api';

export interface SurveyAnswers {
  surveyDate: string;
  dormirPoucoAgressivoIrritadico: boolean;
  adormecerAumentaTemperaturaCorpo: boolean;
  horaDormirNaoInfluenciaQualidadeSono: boolean;
  computadorNoitePrejudicaSono: boolean;
  adolescentesDevemDormir8Horas: boolean;
  concentracaoIndependenteDoSono: boolean;
  dormirSemAtividadeCerebral: boolean;
  indiferenteDormirDiaOuNoite: boolean;
  comerMuitoAntesPrejudicaSono: boolean;
  mensagensNoitePrejudicaSono: boolean;
  dormirPoucoAumentaDoencas: boolean;
  estudarTardeIgualEficazDia: boolean;
  muitaLuzNoiteAlteraRitmo: boolean;
  esforcoFisicoAjudaAdormecer: boolean;
  compensarSonoPerdidoNoiteSeguinte: boolean;
  sonoInsuficienteEngordar: boolean;
  sestaNaoAfetaSonoNoite: boolean;
  luzSolAjudaDormirBem: boolean;
  dormirPoucoAumentaAcidentes: boolean;
  variosTiposSonoNoite: boolean;
}

export const surveyService = {
  async submitSurvey(answers: SurveyAnswers): Promise<void> {
    return apiService.post('/surveys', answers);
  },
};
