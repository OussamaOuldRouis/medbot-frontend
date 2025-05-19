import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Trash2 } from "lucide-react";
import { getRecentInteractions, clearAllInteractions } from "@/lib/interactions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RecentItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
}

const RecentInteractions = () => {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const fetchRecentInteractions = () => {
    try {
      console.log('Fetching recent interactions...');
      const interactions = getRecentInteractions();
      console.log('Retrieved interactions:', interactions);
      
      if (!Array.isArray(interactions)) {
        console.error('Interactions is not an array:', interactions);
        setError('Invalid interactions data format');
        return;
      }

      const formattedItems: RecentItem[] = interactions.map((interaction, index) => {
        try {
          console.log('Processing interaction:', interaction);
          const formattedItem = {
            id: index.toString(),
            title: `${interaction.drug1} + ${interaction.drug2}`,
            description: interaction.description,
            timestamp: new Date(interaction.timestamp)
          };
          console.log('Formatted item:', formattedItem);
          return formattedItem;
        } catch (error) {
          console.error('Error formatting interaction:', error, interaction);
          return null;
        }
      }).filter((item): item is RecentItem => item !== null);
      
      console.log('Setting formatted items:', formattedItems);
      setRecentItems(formattedItems);
      setLastUpdate(new Date());
      setError(null);
    } catch (error) {
      console.error('Error in fetchRecentInteractions:', error);
      setError('Failed to load recent interactions');
    }
  };

  const handleClearAll = () => {
    if (clearAllInteractions()) {
      setRecentItems([]);
      setLastUpdate(new Date());
      setShowClearDialog(false);
    } else {
      setError('Failed to clear interactions');
    }
  };

  // Fetch interactions initially
  useEffect(() => {
    fetchRecentInteractions();
  }, []);

  // Set up an interval to refresh the interactions
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchRecentInteractions();
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-muted/20 py-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Clock size={18} />
            Recent Interactions
          </CardTitle>
          {recentItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive/90"
              onClick={() => setShowClearDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <div className="p-3 text-red-500 text-sm">
            {error}
          </div>
        )}
        <div className="text-xs text-muted-foreground p-3 border-b">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
        <ul className="divide-y">
          {recentItems.length > 0 ? (
            recentItems.map((item) => (
              <li key={item.id} className="p-3 hover:bg-muted/20">
                <div>
                  <div className="text-sm font-medium">{item.title}</div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {item.description}
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {item.timestamp.toLocaleTimeString()} - {item.timestamp.toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="p-3 text-sm text-muted-foreground">
              No recent interactions found
            </li>
          )}
        </ul>
      </CardContent>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Recent Interactions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all recent interactions from your history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleClearAll}
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default RecentInteractions;
