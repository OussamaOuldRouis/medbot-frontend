
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadCloud, Check, AlertCircle, LoaderCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const CertificateSubmission = () => {
  const { user, profile } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing certificate if any
  const { data: certificate, isLoading } = useQuery({
    queryKey: ["certificate", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
        toast.error("Failed to fetch certificate status");
        console.error(error);
      }
      
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.role === "admin") {
    return <Navigate to="/admin/certificates" replace />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      if (["application/pdf", "image/jpeg", "image/png"].indexOf(selectedFile.type) === -1) {
        toast.error("File must be PDF, JPEG, or PNG");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // 2. Create certificate record
      const { error: dbError } = await supabase.from('certificates').insert({
        user_id: user.id,
        file_path: filePath,
      });
      
      if (dbError) throw dbError;
      
      toast.success("Certificate submitted successfully!");
      
      // Reset form
      setFile(null);
      
      // Refresh the data
      window.location.reload();
      
    } catch (error: any) {
      toast.error(error.message || "Failed to submit certificate");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (certificate) {
      return (
        <div className="space-y-6">
          <div className={`p-4 border rounded-lg ${
            certificate.status === 'approved' 
              ? 'bg-green-50 border-green-200' 
              : certificate.status === 'rejected'
                ? 'bg-red-50 border-red-200'
                : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center">
              {certificate.status === 'approved' ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : certificate.status === 'rejected' ? (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              ) : (
                <LoaderCircle className="h-5 w-5 text-yellow-500 mr-2" />
              )}
              <h3 className="font-medium">
                {certificate.status === 'approved' 
                  ? 'Certificate Approved' 
                  : certificate.status === 'rejected'
                    ? 'Certificate Rejected'
                    : 'Pending Review'}
              </h3>
            </div>
            <p className="text-sm mt-2">
              {certificate.status === 'approved' 
                ? 'Your certificate has been approved. You now have full access to the platform.' 
                : certificate.status === 'rejected'
                  ? certificate.notes 
                    ? `Your certificate was rejected: ${certificate.notes}` 
                    : 'Your certificate was rejected. Please submit a new one.'
                  : 'Your certificate is being reviewed by our team. This process typically takes 1-2 business days.'}
            </p>
          </div>
          
          {certificate.status === 'rejected' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certificate">Upload new certificate</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Input
                    id="certificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Label 
                    htmlFor="certificate" 
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                    <span className="text-muted-foreground font-medium">
                      {file ? file.name : "Click to upload or drag & drop"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      PDF, JPEG or PNG (max 5MB)
                    </span>
                  </Label>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={!file || isSubmitting}>
                {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Submit New Certificate
              </Button>
            </form>
          )}
        </div>
      );
    }
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="certificate">Upload your medical certificate</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Input
              id="certificate"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />
            <Label 
              htmlFor="certificate" 
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
              <span className="text-muted-foreground font-medium">
                {file ? file.name : "Click to upload or drag & drop"}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                PDF, JPEG or PNG (max 5MB)
              </span>
            </Label>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={!file || isSubmitting}>
          {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Submit Certificate
        </Button>
      </form>
    );
  };

  return (
    <div className="container mx-auto py-8 max-w-xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>Medical Certificate Submission</CardTitle>
          <CardDescription>
            Please upload your medical certificate to verify your professional status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
        <CardFooter className="flex-col text-sm text-muted-foreground space-y-2">
          <p>
            Accepted documents: Medical license, physician certification, pharmacy license or any government-issued healthcare credentials.
          </p>
          <p>
            All certificates are verified by our team before account approval.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CertificateSubmission;
