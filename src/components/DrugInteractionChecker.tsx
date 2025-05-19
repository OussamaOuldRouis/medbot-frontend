import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { addInteraction } from "@/lib/interactions";
import { predictInteraction } from "@/lib/prediction";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Drug {
  id: string;
  name: string;
}

interface Interaction {
  id: string;
  severity: "mild" | "moderate" | "severe";
  description: string;
  confidence: number;
  warning?: string;
}

interface DrugInteraction {
  drug1: string;
  drug2: string;
  interaction_description: string;
  severity: string;
}

const DrugInteractionChecker = () => {
  const [selectedDrugs, setSelectedDrugs] = useState<Drug[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [interactionResults, setInteractionResults] = useState<Interaction | null>(null);
  const [availableDrugs, setAvailableDrugs] = useState<Drug[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available drugs from Supabase
  const { data: interactionsData } = useQuery({
    queryKey: ["drug-interactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drug_interactions")
        .select("*")
        .eq("is_approved", true);

      if (error) {
        console.error('Error fetching interactions:', error);
        setError("Failed to load drug interactions");
        return [];
      }

      return data as DrugInteraction[];
    }
  });

  useEffect(() => {
    if (interactionsData) {
      // Extract unique drug names from the interactions
      const uniqueDrugs = new Set<string>();
      interactionsData.forEach(interaction => {
        if (interaction.drug1) uniqueDrugs.add(interaction.drug1);
        if (interaction.drug2) uniqueDrugs.add(interaction.drug2);
      });

      // Convert to Drug objects with unique IDs
      const drugs: Drug[] = Array.from(uniqueDrugs).map((name, index) => ({
        id: `drug-${index}`,
        name
      }));
      setAvailableDrugs(drugs);
    }
  }, [interactionsData]);

  const filteredSuggestions = searchValue
    ? availableDrugs.filter((drug) =>
        drug.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];

  const addDrug = async (drug: Drug) => {
    if (selectedDrugs.find((d) => d.id === drug.id)) return;
    
    console.log('Adding drug:', drug);
    setSelectedDrugs([...selectedDrugs, drug]);
    setSearchValue("");
    
    // Check for interactions when two or more drugs are selected
    if (selectedDrugs.length > 0) {
      const lastAddedDrug = drug;
      const previousDrug = selectedDrugs[selectedDrugs.length - 1];
      
      console.log('Checking interaction between:', { 
        drug1: lastAddedDrug.name, 
        drug2: previousDrug.name 
      });
      
      try {
        setIsLoading(true);
        const prediction = await predictInteraction(lastAddedDrug.name, previousDrug.name);
        console.log('Prediction response:', prediction);
        
        // Create interaction result regardless of has_interaction flag
        const interactionResult: Interaction = {
          id: `int-${lastAddedDrug.id}-${previousDrug.id}`,
          severity: prediction.severity as "mild" | "moderate" | "severe",
          description: prediction.description || "",
          confidence: prediction.confidence,
          warning: prediction.warning
        };
        console.log('Created interaction result:', interactionResult);
        setInteractionResults(interactionResult);

        // Store the interaction in history if there's a description
        if (prediction.description) {
          console.log('Storing interaction:', {
            drug1: lastAddedDrug.name,
            drug2: previousDrug.name,
            description: prediction.description
          });
          
          const stored = addInteraction(
            lastAddedDrug.name,
            previousDrug.name,
            prediction.description
          );
          
          console.log('Interaction stored:', stored);
        }
      } catch (error) {
        console.error('Error predicting interaction:', error);
        setError("Failed to predict drug interaction");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeDrug = (drugId: string) => {
    setSelectedDrugs(selectedDrugs.filter((drug) => drug.id !== drugId));
    if (selectedDrugs.length <= 2) {
      setInteractionResults(null);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-muted/20 py-4 border-b">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Search size={20} />
          Drug Interaction Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {error && (
          <div className="text-red-500 text-sm mb-2">
            Error: {error}
          </div>
        )}
        <div className="relative">
          <Input
            placeholder="Search for drugs to check interactions..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full"
          />
          {searchValue && filteredSuggestions.length > 0 && (
            <div className="absolute w-full mt-1 border rounded-md bg-background shadow-md z-10">
              {filteredSuggestions.map((drug) => (
                <div
                  key={drug.id}
                  className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                  onClick={() => addDrug(drug)}
                >
                  {drug.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Selected Drugs</h3>
          <div className="flex flex-wrap gap-2">
            {selectedDrugs.map((drug) => (
              <div
                key={drug.id}
                className="bg-muted text-muted-foreground px-3 py-1 rounded-full flex items-center gap-1 text-sm"
              >
                {drug.name}
                <button
                  onClick={() => removeDrug(drug.id)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {selectedDrugs.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No drugs selected. Please search and add drugs to check for interactions.
              </p>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="text-sm text-muted-foreground">
            Predicting interaction...
          </div>
        )}

        {interactionResults && (
          <div className="space-y-3">
            {interactionResults.warning && (
              <div className="p-3 rounded-md border bg-yellow-50 border-yellow-200">
                <p className="text-sm text-yellow-700">{interactionResults.warning}</p>
              </div>
            )}
            <div className={`p-3 rounded-md border 
              ${
                interactionResults.severity === "severe"
                  ? "bg-red-50 border-red-200"
                  : interactionResults.severity === "moderate"
                  ? "bg-orange-50 border-orange-200" 
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <h3 className={`text-sm font-semibold mb-1 
                ${
                  interactionResults.severity === "severe"
                    ? "text-red-700"
                    : interactionResults.severity === "moderate"
                    ? "text-orange-700" 
                    : "text-yellow-700"
                }`}
              >
                {interactionResults.severity ? 
                  `${interactionResults.severity.charAt(0).toUpperCase() + interactionResults.severity.slice(1)} Interaction Detected` :
                  "No Interaction Detected"
                }
                <span className="ml-2 text-xs">
                  (Confidence: {interactionResults.confidence.toFixed(1)}%)
                </span>
              </h3>
              {interactionResults.description && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Interaction Description:</p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{interactionResults.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DrugInteractionChecker;
