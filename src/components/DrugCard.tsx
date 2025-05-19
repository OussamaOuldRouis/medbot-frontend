
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Pill } from "lucide-react";
import { Drug } from "@/pages/DrugSearch";

interface DrugCardProps {
  drug: Drug;
  onViewDetails: () => void;
}

const DrugCard = ({ drug, onViewDetails }: DrugCardProps) => {
  // Get the PubChem CID for the drug (you would typically get this from your API)
  const getPubChemImageUrl = (drugName: string) => {
    // This is a mapping of drug names to their PubChem CIDs
    const cidMap: { [key: string]: string } = {
      'Aspirin': '2244',
      'Lisinopril': '5362119',
      'Metformin': '4091',
      'Atorvastatin': '60823',
      'Sertraline': '68617',
      'Ibuprofen': '3672',
      'Omeprazole': '4594',
      'Amlodipine': '2162'
    };

    const cid = cidMap[drugName];
    if (cid) {
      return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?record_type=2d&image_size=300x300`;
    }
    return null;
  };

  const structureImageUrl = getPubChemImageUrl(drug.name);

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/40 relative overflow-hidden">
      {/* Category badge */}
      <div className="absolute top-3 right-3 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
        {drug.category}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{drug.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{drug.genericName}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          {structureImageUrl ? (
            <div className="w-[200px] h-[200px] bg-white/50 rounded-lg p-2 flex items-center justify-center shadow-sm">
              <img 
                src={structureImageUrl} 
                alt={`Chemical structure of ${drug.name}`}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-[200px] h-[200px] flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <Pill className="mx-auto h-10 w-10 text-primary/30 mb-2" />
                <p className="text-sm text-muted-foreground">Structure not available</p>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm line-clamp-2">{drug.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {drug.commonUses && drug.commonUses.length > 0 && (
              <div className="w-full">
                <p className="text-xs text-muted-foreground mb-1">Common Uses:</p>
                <div className="flex flex-wrap gap-1.5">
                  {drug.commonUses.slice(0, 2).map((use, index) => (
                    <span key={index} className="px-2 py-1 bg-secondary/80 text-secondary-foreground text-xs rounded-md">
                      {use}
                    </span>
                  ))}
                  {drug.commonUses.length > 2 && (
                    <span className="px-2 py-1 bg-secondary/80 text-secondary-foreground text-xs rounded-md">
                      +{drug.commonUses.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full group hover:bg-primary hover:text-primary-foreground border-primary/30"
          onClick={onViewDetails}
        >
          <Info className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default DrugCard;
