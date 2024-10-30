import { Card } from "@/components/ui/card";

interface NotesData {
  methodes_comptables: string[];
  engagements_hors_bilan: string[];
  evenements_post_cloture: string[];
  risques_incertitudes: string[];
}

interface NotesProps {
  data: NotesData;
}

export const Notes = ({ data }: NotesProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Notes Annexes</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Méthodes Comptables</h4>
          <ul className="list-disc pl-5 space-y-2">
            {data.methodes_comptables.map((methode, index) => (
              <li key={index} className="text-sm">{methode}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-3">Engagements Hors Bilan</h4>
          <ul className="list-disc pl-5 space-y-2">
            {data.engagements_hors_bilan.map((engagement, index) => (
              <li key={index} className="text-sm">{engagement}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-3">Événements Post-Clôture</h4>
          <ul className="list-disc pl-5 space-y-2">
            {data.evenements_post_cloture.map((evenement, index) => (
              <li key={index} className="text-sm">{evenement}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-3">Risques et Incertitudes</h4>
          <ul className="list-disc pl-5 space-y-2">
            {data.risques_incertitudes.map((risque, index) => (
              <li key={index} className="text-sm">{risque}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};