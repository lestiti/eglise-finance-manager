import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const ProjectList = () => {
  const projects = [
    {
      id: 1,
      nom: "Construction Centre Communautaire",
      objectif: "Construction",
      responsable: "RAKOTO Jean",
      budget: "1 000 000 000",
      depense: "400 000 000",
      progression: 30,
      collecte: "600 000 000",
    },
    {
      id: 2,
      nom: "Rénovation Toiture",
      objectif: "Rénovation",
      responsable: "RABE Pierre",
      budget: "500 000 000",
      depense: "450 000 000",
      progression: 90,
      collecte: "480 000 000",
    },
  ];

  return (
    <Card className="p-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projet</TableHead>
              <TableHead>Objectif</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Dépenses</TableHead>
              <TableHead>Collecté</TableHead>
              <TableHead>Progression</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const depenseRatio = (parseInt(project.depense.replace(/,/g, "")) / parseInt(project.budget.replace(/,/g, ""))) * 100;
              const collecteRatio = (parseInt(project.collecte.replace(/,/g, "")) / parseInt(project.budget.replace(/,/g, ""))) * 100;
              
              return (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.nom}</TableCell>
                  <TableCell>{project.objectif}</TableCell>
                  <TableCell>{project.responsable}</TableCell>
                  <TableCell>{project.budget} Ar</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{project.depense} Ar</span>
                        <span>{depenseRatio.toFixed(0)}%</span>
                      </div>
                      <Progress value={depenseRatio} className="h-2" />
                      {depenseRatio > 90 && (
                        <Alert variant="destructive" className="py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Attention: Budget presque épuisé
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{project.collecte} Ar</span>
                        <span>{collecteRatio.toFixed(0)}%</span>
                      </div>
                      <Progress value={collecteRatio} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Avancement</span>
                        <span>{project.progression}%</span>
                      </div>
                      <Progress value={project.progression} className="h-2" />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};