import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, CheckCircle, XCircle, LoaderCircle, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  interaction_description: string;
  severity: string | null;
  is_approved: boolean;
  created_at: string;
}

const AdminDrugs = () => {
  const { user, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<DrugInteraction | null>(null);
  
  const [drug1, setDrug1] = useState("");
  const [drug2, setDrug2] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<string>("mild");

  const { data: interactions, isLoading, refetch } = useQuery({
    queryKey: ["drug-interactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drug_interactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load drug interactions");
        throw error;
      }
      
      return data as DrugInteraction[];
    },
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const resetForm = () => {
    setDrug1("");
    setDrug2("");
    setDescription("");
    setSeverity("mild");
    setEditingInteraction(null);
  };

  const updateRAGSystem = async (interaction: {
    drug1: string;
    drug2: string;
    interaction_description: string;
    severity: string;
  }) => {
    try {
      const API_URL = 'http://localhost:8000'; // Hardcoded API URL
      console.log('Updating RAG system with:', interaction);
      
      const response = await fetch(`${API_URL}/update-rag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update RAG system');
      }

      const result = await response.json();
      console.log('RAG system update result:', result);
      return result;
    } catch (error: any) {
      console.error('Error updating RAG system:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingInteraction) {
        // Update existing drug interaction
        const { error } = await supabase
          .from("drug_interactions")
          .update({
            drug1,
            drug2,
            interaction_description: description,
            severity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingInteraction.id);
          
        if (error) throw error;

        // Update RAG system
        try {
          await updateRAGSystem({
            drug1,
            drug2,
            interaction_description: description,
            severity,
          });
          toast.success("RAG system updated successfully");
        } catch (ragError: any) {
          toast.error(`Database updated but RAG update failed: ${ragError.message}`);
          console.error('RAG update error:', ragError);
        }
        
        toast.success("Drug interaction updated successfully");
      } else {
        // Create new drug interaction
        const { error } = await supabase
          .from("drug_interactions")
          .insert({
            drug1,
            drug2,
            interaction_description: description,
            severity,
            created_by: user.id,
            is_approved: true, // Auto-approve as admin is creating it
          });
          
        if (error) throw error;

        // Update RAG system
        try {
          await updateRAGSystem({
            drug1,
            drug2,
            interaction_description: description,
            severity,
          });
          toast.success("RAG system updated successfully");
        } catch (ragError: any) {
          toast.error(`Database updated but RAG update failed: ${ragError.message}`);
          console.error('RAG update error:', ragError);
        }
        
        toast.success("Drug interaction created successfully");
      }
      
      refetch();
      resetForm();
      setIsDialogOpen(false);
      
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (interaction: DrugInteraction) => {
    setEditingInteraction(interaction);
    setDrug1(interaction.drug1);
    setDrug2(interaction.drug2);
    setDescription(interaction.interaction_description);
    setSeverity(interaction.severity || "mild");
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!editingInteraction) return;
    
    setIsSubmitting(true);
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from("drug_interactions")
        .delete()
        .eq("id", editingInteraction.id);
        
      if (error) throw error;

      // Delete from RAG system
      const API_URL = 'http://localhost:8000'; // Hardcoded API URL
      await fetch(`${API_URL}/delete-rag`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drug1: editingInteraction.drug1,
          drug2: editingInteraction.drug2,
        }),
      });
      
      toast.success("Drug interaction deleted successfully");
      
      refetch();
      setEditingInteraction(null);
      setIsDeleteDialogOpen(false);
      
    } catch (error: any) {
      toast.error(error.message || "Failed to delete interaction");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleApproval = async (interaction: DrugInteraction) => {
    try {
      const { error } = await supabase
        .from("drug_interactions")
        .update({
          is_approved: !interaction.is_approved,
          updated_at: new Date().toISOString(),
        })
        .eq("id", interaction.id);
        
      if (error) throw error;
      
      toast.success(
        interaction.is_approved 
          ? "Interaction unpublished" 
          : "Interaction approved and published"
      );
      
      refetch();
      
    } catch (error: any) {
      toast.error(error.message || "Failed to update approval status");
      console.error(error);
    }
  };
  
  const filteredInteractions = interactions?.filter((interaction) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      interaction.drug1.toLowerCase().includes(searchLower) ||
      interaction.drug2.toLowerCase().includes(searchLower) ||
      interaction.interaction_description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Drug Interactions Management</CardTitle>
              <CardDescription>
                Create, edit and manage drug interaction information
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Interaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingInteraction ? "Edit Drug Interaction" : "Add New Drug Interaction"}
                  </DialogTitle>
                  <DialogDescription>
                    Enter the details of the drug interaction below.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="drug1">First Drug</Label>
                      <Input
                        id="drug1"
                        value={drug1}
                        onChange={(e) => setDrug1(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="drug2">Second Drug</Label>
                      <Input
                        id="drug2"
                        value={drug2}
                        onChange={(e) => setDrug2(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Interaction Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <DialogFooter className="mt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                      {editingInteraction ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search interactions by drug name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoaderCircle className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : filteredInteractions && filteredInteractions.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Drugs</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInteractions.map((interaction) => (
                      <TableRow key={interaction.id}>
                        <TableCell>
                          <div className="font-medium">{interaction.drug1}</div>
                          <div className="text-muted-foreground">+ {interaction.drug2}</div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            interaction.severity === 'severe' 
                              ? 'bg-red-100 text-red-800' 
                              : interaction.severity === 'moderate'
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {interaction.severity === 'severe' 
                              ? 'Severe' 
                              : interaction.severity === 'moderate'
                                ? 'Moderate' 
                                : 'Mild'}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-sm truncate">
                          {interaction.interaction_description}
                        </TableCell>
                        <TableCell>
                          {interaction.is_approved ? (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
                              <XCircle className="mr-1 h-3 w-3" />
                              Draft
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(interaction)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleApproval(interaction)}
                            >
                              {interaction.is_approved ? (
                                <XCircle className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive hover:text-destructive/90"
                              onClick={() => {
                                setEditingInteraction(interaction);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No matching interactions found" : "No drug interactions available"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this drug interaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDrugs;
