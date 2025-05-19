
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Drug } from "@/pages/DrugSearch";
import { Pill } from "lucide-react";

interface DrugInfoModalProps {
  drug: Drug;
  open: boolean;
  onClose: () => void;
}

const DrugInfoModal = ({ drug, open, onClose }: DrugInfoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="text-primary" size={20} />
            {drug.name} ({drug.genericName})
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {drug.category}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <h4 className="font-medium mb-1">Description</h4>
            <p>{drug.description}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Common Uses</h4>
            <ul className="list-disc pl-5 space-y-1">
              {drug.commonUses.map((use, index) => (
                <li key={index}>{use}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Side Effects</h4>
            <ul className="list-disc pl-5 space-y-1">
              {drug.sideEffects.map((effect, index) => (
                <li key={index}>{effect}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Contraindications</h4>
            <ul className="list-disc pl-5 space-y-1">
              {drug.contraindications.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Known Drug Interactions</h4>
            <ul className="list-disc pl-5 space-y-1">
              {drug.interactions.map((interaction, index) => (
                <li key={index}>{interaction}</li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DrugInfoModal;
