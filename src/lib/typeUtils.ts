import { Json } from "@/integrations/supabase/types";
import { FinancialData } from "@/types/financial";

export const convertToJson = (data: FinancialData): Json => {
  return JSON.parse(JSON.stringify(data)) as Json;
};