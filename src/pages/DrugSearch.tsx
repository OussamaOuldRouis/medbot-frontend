import { useState } from "react";
import { Search, Info, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DrugCard from "@/components/DrugCard";
import DrugInfoModal from "@/components/DrugInfoModal";

// Mock data - would be replaced with API data in production
const mockDrugs = [
  {
    id: "1",
    name: "Aspirin",
    genericName: "Acetylsalicylic acid",
    category: "NSAID",
    description: "Common pain reliever, fever reducer, and anti-inflammatory medication.",
    commonUses: ["Pain relief", "Fever reduction", "Anti-inflammatory", "Prevention of blood clots"],
    sideEffects: ["Stomach upset", "Heartburn", "Nausea", "Gastrointestinal bleeding"],
    contraindications: ["Peptic ulcer disease", "Hemophilia", "Children under 12 (risk of Reye's syndrome)"],
    interactions: ["Anticoagulants", "Other NSAIDs", "Alcohol"]
  },
  {
    id: "2",
    name: "Lisinopril",
    genericName: "Lisinopril",
    category: "ACE Inhibitor",
    description: "Medication that helps relax blood vessels to treat high blood pressure and heart failure.",
    commonUses: ["Hypertension", "Heart failure", "Prevention of kidney problems in diabetes"],
    sideEffects: ["Dry cough", "Dizziness", "Headache", "Fatigue"],
    contraindications: ["Pregnancy", "History of angioedema", "Bilateral renal artery stenosis"],
    interactions: ["Potassium supplements", "NSAIDs", "Lithium"]
  },
  {
    id: "3",
    name: "Metformin",
    genericName: "Metformin hydrochloride",
    category: "Biguanide",
    description: "First-line medication for the treatment of type 2 diabetes.",
    commonUses: ["Type 2 diabetes management", "Insulin resistance", "Polycystic ovary syndrome (PCOS)"],
    sideEffects: ["Nausea", "Diarrhea", "Stomach pain", "Metallic taste"],
    contraindications: ["Kidney disease", "Liver disease", "Heart failure", "Alcoholism"],
    interactions: ["Certain contrast dyes", "Furosemide", "Nifedipine"]
  },
  {
    id: "4",
    name: "Atorvastatin",
    genericName: "Atorvastatin calcium",
    category: "Statin",
    description: "Medication that reduces levels of bad cholesterol (LDL) and triglycerides in the blood.",
    commonUses: ["High cholesterol", "Prevention of cardiovascular disease"],
    sideEffects: ["Muscle pain", "Liver enzyme elevation", "Digestive problems", "Rash"],
    contraindications: ["Liver disease", "Pregnancy", "Breastfeeding"],
    interactions: ["Certain antibiotics", "Antifungals", "Grapefruit juice"]
  },
  {
    id: "5",
    name: "Sertraline",
    genericName: "Sertraline hydrochloride",
    category: "SSRI",
    description: "Selective serotonin reuptake inhibitor (SSRI) antidepressant.",
    commonUses: ["Depression", "Panic disorder", "OCD", "PTSD", "Social anxiety disorder"],
    sideEffects: ["Nausea", "Diarrhea", "Insomnia", "Sexual dysfunction"],
    contraindications: ["MAOIs", "Pimozide", "Disulfiram (if taking liquid sertraline)"],
    interactions: ["NSAIDs", "Warfarin", "Other SSRIs", "Tramadol"]
  },
  {
    id: "6",
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    category: "NSAID",
    description: "Nonsteroidal anti-inflammatory drug used for pain relief, fever reduction, and inflammation.",
    commonUses: ["Pain relief", "Fever reduction", "Inflammation", "Headaches"],
    sideEffects: ["Stomach pain", "Heartburn", "Dizziness", "Mild headache"],
    contraindications: ["Peptic ulcer disease", "Kidney disease", "Heart disease"],
    interactions: ["Aspirin", "Blood pressure medications", "Diuretics"]
  },
  {
    id: "7",
    name: "Omeprazole",
    genericName: "Omeprazole",
    category: "Proton Pump Inhibitor",
    description: "Medication that reduces stomach acid production to treat acid-related conditions.",
    commonUses: ["GERD", "Peptic ulcers", "Zollinger-Ellison syndrome"],
    sideEffects: ["Headache", "Diarrhea", "Stomach pain", "Nausea"],
    contraindications: ["Liver disease", "Osteoporosis", "Low magnesium levels"],
    interactions: ["Clopidogrel", "Diazepam", "Warfarin"]
  },
  {
    id: "8",
    name: "Amlodipine",
    genericName: "Amlodipine besylate",
    category: "Calcium Channel Blocker",
    description: "Medication that relaxes blood vessels to treat high blood pressure and chest pain.",
    commonUses: ["Hypertension", "Angina", "Coronary artery disease"],
    sideEffects: ["Swelling in ankles", "Dizziness", "Flushing", "Headache"],
    contraindications: ["Severe aortic stenosis", "Hypotension"],
    interactions: ["Simvastatin", "Cyclosporine", "Grapefruit juice"]
  }
];

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  commonUses: string[];
  sideEffects: string[];
  contraindications: string[];
  interactions: string[];
}

const DrugSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredDrugs = mockDrugs.filter(drug => 
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (drug: Drug) => {
    setSelectedDrug(drug);
    setModalOpen(true);
  };

  return (
    <div className="container mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Drug Encyclopedia</h1>
      
      <Card className="mb-8 shadow-md border-border/40">
        <CardHeader className="bg-primary/5 py-4 border-b">
          <CardTitle className="text-xl flex items-center gap-2 text-primary">
            <Search size={20} />
            Search Medications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by drug name, generic name, or category..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border/40"
              />
            </div>
            <Button>
              <Filter size={18} className="mr-2" />
              <span>Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrugs.length > 0 ? (
          filteredDrugs.map((drug, index) => (
            <div key={drug.id} style={{animationDelay: `${index * 0.1}s`}} className="animate-slide-in">
              <DrugCard 
                drug={drug} 
                onViewDetails={() => handleOpenModal(drug)} 
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 bg-muted/30 rounded-lg border border-border/40">
            <div className="text-muted-foreground mb-2 flex flex-col items-center">
              <Search size={48} className="text-muted-foreground/50 mb-4" />
              <p className="font-medium text-lg">No drugs match your search criteria</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search terms or browse our list without filters</p>
          </div>
        )}
      </div>

      {selectedDrug && (
        <DrugInfoModal
          drug={selectedDrug}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DrugSearch;
