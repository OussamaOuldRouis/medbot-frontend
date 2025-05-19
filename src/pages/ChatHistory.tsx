import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Calendar, FileDown, Trash2 } from "lucide-react";
import { getChatSessions, deleteChatSession } from "@/lib/chatHistory";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ChatSession {
  id: string;
  title: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    drugs?: string[];
    timestamp: string;
  }>;
  timestamp: string;
}

const ChatHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load chat sessions
  useEffect(() => {
    const loadSessions = () => {
      console.log('Loading chat sessions...');
      const chatSessions = getChatSessions();
      console.log('Retrieved chat sessions:', chatSessions);
      setSessions(chatSessions);
    };

    loadSessions();
    // Refresh every 5 seconds
    const intervalId = setInterval(loadSessions, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Filter sessions based on search term
  const filteredSessions = sessions.filter(session => {
    const searchLower = searchTerm.toLowerCase();
    return (
      session.title.toLowerCase().includes(searchLower) ||
      session.messages.some(message => 
        message.content.toLowerCase().includes(searchLower) ||
        message.drugs?.some(drug => 
          drug.toLowerCase().includes(searchLower)
        )
      )
    );
  });

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      const success = deleteChatSession(sessionId);
      if (success) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        toast({
          title: "Success",
          description: "Chat session deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete chat session",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewSession = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Chat History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats by drug name or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <button className="flex items-center gap-1 px-3 py-2 border rounded-md bg-muted/30 hover:bg-muted">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Filter by date</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-2 border rounded-md bg-muted/30 hover:bg-muted">
              <FileDown className="h-4 w-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>

          <div className="space-y-2">
            {filteredSessions.length > 0 ? (
              filteredSessions.map(session => (
                <div 
                  key={session.id} 
                  className="p-3 border rounded-md hover:bg-muted/20 cursor-pointer transition-colors"
                  onClick={() => handleViewSession(session.id)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{session.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(session.timestamp)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.id);
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {session.messages.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {session.messages[0].content.substring(0, 100)}
                      {session.messages[0].content.length > 100 ? '...' : ''}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Array.from(new Set(
                      session.messages.flatMap(message => message.drugs || [])
                    )).map(drug => (
                      <span 
                        key={drug} 
                        className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                      >
                        {drug}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                {searchTerm ? 'No conversations matching your search.' : 'No chat history yet. Start a new chat to see it here.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatHistory;
