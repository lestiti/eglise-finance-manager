import { Json } from "@/integrations/supabase/types";

export interface FinancialData {
  bilan: {
    actifs_courants: {
      liquidites: number;
      comptes_clients: number;
      stocks: number;
    };
    actifs_non_courants: {
      immobilisations: number;
      investissements_long_terme: number;
    };
    passifs_courants: {
      dettes_court_terme: number;
      comptes_fournisseurs: number;
    };
    passifs_non_courants: {
      emprunts_long_terme: number;
      obligations: number;
    };
    capitaux_propres: {
      capital_social: number;
      reserves: number;
      resultat_net: number;
    };
  };
  compte_resultat: {
    chiffre_affaires: {
      total: number;
      par_segment: Record<string, number>;
    };
    cout_ventes: {
      total: number;
      details: Record<string, number>;
    };
    charges_exploitation: {
      charges_administratives: number;
      charges_vente: number;
      autres_charges: number;
    };
    resultat_financier: {
      produits_financiers: number;
      charges_financieres: number;
    };
    impots: number;
  };
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

export const isFinancialData = (data: unknown): data is FinancialData => {
  const d = data as FinancialData;
  return (
    d &&
    typeof d === 'object' &&
    'bilan' in d &&
    'compte_resultat' in d &&
    'flux_tresorerie' in d &&
    'notes' in d
  );
};