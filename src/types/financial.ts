export interface FinancialData {
  flux_tresorerie: {
    activites_operationnelles: {
      encaissements_clients: number;
      decaissements_fournisseurs: number;
      decaissements_salaires: number;
      autres_flux_operationnels: number;
    };
    activites_investissement: {
      acquisitions_immobilisations: number;
      cessions_immobilisations: number;
      investissements_financiers: number;
    };
    activites_financement: {
      emprunts_nouveaux: number;
      remboursements_emprunts: number;
      variations_capital: number;
    };
    tresorerie: {
      debut_periode: number;
      fin_periode: number;
    };
  };
  notes: {
    methodes_comptables: string[];
    engagements_hors_bilan: string[];
    evenements_post_cloture: string[];
    risques_incertitudes: string[];
  };
}