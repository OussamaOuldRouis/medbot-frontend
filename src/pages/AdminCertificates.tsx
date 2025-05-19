import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Clock, LoaderCircle, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface Certificate {
  id: string;
  user_id: string;
  file_path: string;
  status: string;
  submitted_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  approved_by: string | null;
  notes: string | null;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  };
}

const AdminCertificates = () => {
  const { user, profile, isAdmin } = useAuth();
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const { data: certificates, isLoading, error: queryError, refetch } = useQuery({
    queryKey: ["certificates", activeTab],
    queryFn: async () => {
      try {
        console.log('Fetching certificates for status:', activeTab);
        
        // First, verify the user and admin status
        console.log('Current user:', user);
        console.log('Is admin:', isAdmin);

        // Check if we're properly connected to Supabase
        const { data: testConnection, error: testError } = await supabase
          .from("certificates")
          .select("count")
          .single();
          
        console.log('Connection test:', { data: testConnection, error: testError });

        // Now perform the actual query
        const { data: certificates, error: certError } = await supabase
          .from("certificates")
          .select(`
            id,
            user_id,
            file_path,
            status,
            submitted_at,
            approved_at,
            rejected_at,
            approved_by,
            notes
          `)
          .eq("status", activeTab)
          .order("submitted_at", { ascending: false });

        if (certError) {
          console.error('Error fetching certificates:', certError);
          throw certError;
        }
        
        console.log('Received certificates data:', certificates);
        
        // Fetch user data for each certificate
        const userIds = certificates.map(cert => cert.user_id);
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);

        if (profileError) {
          console.error('Error fetching profiles:', profileError);
          throw profileError;
        }

        // Create a map of profile data for easy lookup
        const profileMap = profiles.reduce((acc, profile) => {
          acc[profile.id] = {
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: null // We don't have email in profiles table
          };
          return acc;
        }, {} as Record<string, { first_name: string | null; last_name: string | null; email: string | null }>);

        // Transform the data to match our Certificate interface
        const transformedData = certificates.map(cert => ({
          ...cert,
          profiles: profileMap[cert.user_id] || {
            first_name: null,
            last_name: null,
            email: null
          }
        }));
        
        console.log('Transformed certificates:', transformedData);
        return transformedData as Certificate[];
      } catch (error) {
        console.error('Error in certificate query:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
        }
        throw error;
      }
    },
    retry: 1, // Only retry once
    retryDelay: 1000, // Wait 1 second before retrying
  });

  useEffect(() => {
    if (queryError) {
      toast.error("Failed to load certificates. Please try refreshing the page.");
    }
  }, [queryError]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("certificates")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: user.id,
        })
        .eq("id", id);

      if (error) throw error;
      toast.success("Certificate approved successfully");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve certificate");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCertificate) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("certificates")
        .update({
          status: "rejected",
          rejected_at: new Date().toISOString(),
          notes: rejectionReason || null,
        })
        .eq("id", selectedCertificate.id);

      if (error) throw error;
      toast.success("Certificate rejected");
      setRejectionReason("");
      setSelectedCertificate(null);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject certificate");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCertificate = async (certificate: Certificate) => {
    try {
      const { data, error } = await supabase.storage
        .from("certificates")
        .download(certificate.file_path);
      
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificate.profiles.last_name || 'user'}.${certificate.file_path.split('.').pop()}`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download certificate");
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>Certificate Management</CardTitle>
          <CardDescription>
            Review and process medical certificate submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" value={activeTab} onValueChange={(value) => setActiveTab(value as 'pending' | 'approved' | 'rejected')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            {["pending", "approved", "rejected"].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <LoaderCircle className="h-8 w-8 text-primary animate-spin" />
                  </div>
                ) : queryError ? (
                  <div className="text-center py-8 text-red-500">
                    Failed to load certificates. Please try refreshing the page.
                  </div>
                ) : certificates?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No {status} certificates found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {certificates?.map((cert) => (
                      <Card key={cert.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="font-medium">
                                {cert.profiles?.first_name} {cert.profiles?.last_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {cert.profiles?.email}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Submitted: {new Date(cert.submitted_at).toLocaleString()}
                              </p>
                              {cert.status === "approved" && cert.approved_at && (
                                <p className="text-xs text-muted-foreground">
                                  Approved: {new Date(cert.approved_at).toLocaleString()}
                                </p>
                              )}
                              {cert.status === "rejected" && cert.rejected_at && (
                                <>
                                  <p className="text-xs text-muted-foreground">
                                    Rejected: {new Date(cert.rejected_at).toLocaleString()}
                                  </p>
                                  {cert.notes && (
                                    <p className="text-xs text-muted-foreground">
                                      Reason: {cert.notes}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadCertificate(cert)}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {cert.status === "pending" && (
                                <>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApprove(cert.id)}
                                    disabled={isProcessing}
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setSelectedCertificate(cert)}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reject
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Reject Certificate</DialogTitle>
                                        <DialogDescription>
                                          Please provide a reason for rejecting this certificate.
                                          This will be visible to the user.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="reason">Reason</Label>
                                          <Textarea
                                            id="reason"
                                            placeholder="Please provide a valid medical license or certification..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button 
                                          variant="outline" 
                                          onClick={() => {
                                            setSelectedCertificate(null);
                                            setRejectionReason("");
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                        <Button 
                                          variant="destructive" 
                                          onClick={handleReject}
                                          disabled={isProcessing}
                                        >
                                          {isProcessing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                          Confirm Rejection
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCertificates;
