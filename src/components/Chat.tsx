import { useState, useEffect } from 'react';
import { addInteraction } from '@/lib/interactions';
import { addChatMessage, getChatSessions } from '@/lib/chatHistory';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';

interface ChatResponse {
  response: string;
  summary: string;
  drugs: string[];
  interaction_found: boolean;
  interaction_details?: {
    drug1: string;
    drug2: string;
    description: string;
  };
}

export default function Chat() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => {
    // Try to get the most recent session ID first
    const sessions = getChatSessions();
    if (sessions.length > 0) {
      console.log('Using existing session ID:', sessions[0].id);
      return sessions[0].id;
    }
    // If no sessions exist, create a new one
    const id = Date.now().toString();
    console.log('Generated new session ID:', id);
    return id;
  });

  // Query to check certificate status
  const { data: certificate, isLoading: certificateLoading } = useQuery({
    queryKey: ["certificate", user?.id],
    queryFn: async () => {
      if (!user || isAdmin) return { status: 'approved' }; // Return approved status for admins
      
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error && error.code !== "PGRST116") {
        console.error('Error fetching certificate:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user,
  });

  // Load existing messages from chat history
  useEffect(() => {
    const loadMessages = async () => {
      try {
        console.log('Loading messages for session:', sessionId);
        const sessions = getChatSessions();
        const session = sessions.find(s => s.id === sessionId);
        console.log('Found session:', session);
        
        if (session) {
          const loadedMessages = session.messages.map(m => ({
            role: m.role,
            content: m.content
          }));
          console.log('Loaded messages:', loadedMessages);
          setMessages(loadedMessages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadMessages();
  }, [sessionId]);

  // If certificate is not approved, show message
  if (!certificateLoading && (!certificate || certificate.status !== 'approved')) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader className="bg-muted/20 py-3 border-b">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Drug Interaction Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4 flex flex-col items-center justify-center text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Certificate Required</h3>
          <p className="text-muted-foreground mb-4">
            You need an approved medical certificate to use the chat feature.
          </p>
          <Button onClick={() => navigate('/certificate')}>
            Submit Certificate
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setError(null);
    
    // Add user message to state and history
    const userMessageObj = { role: 'user' as const, content: userMessage };
    console.log('Adding user message:', { sessionId, message: userMessageObj });
    setMessages(prev => [...prev, userMessageObj]);
    const stored = addChatMessage(sessionId, userMessageObj);
    console.log('User message stored:', stored);
    
    setIsLoading(true);

    try {
      console.log('Sending chat request:', { message: userMessage });

      const response = await fetch('http://localhost:8001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      console.log('Full API Response:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      // Format the response message
      const formattedResponse = data.response;

      // Add the assistant's response to the chat and history
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: formattedResponse
      };
      setMessages(prev => [...prev, assistantMessage]);
      const storedAssistant = addChatMessage(sessionId, assistantMessage);

      // Store interaction if found
      if (data.interaction_found && data.interaction_details) {
        console.log('Storing interaction:', {
          drug1: data.interaction_details.drug1,
          drug2: data.interaction_details.drug2,
          description: data.interaction_details.description
        });
        
        const stored = addInteraction(
          data.interaction_details.drug1,
          data.interaction_details.drug2,
          data.interaction_details.description
        );
        
        console.log('Interaction stored:', stored);
        
        // Update chat session title
        const storedSessions = localStorage.getItem('chatSessions');
        if (storedSessions) {
          const sessions = JSON.parse(storedSessions);
          const session = sessions.find((s: any) => s.id === sessionId);
          if (session) {
            session.title = `Chat about ${data.interaction_details.drug1} and ${data.interaction_details.drug2}`;
            localStorage.setItem('chatSessions', JSON.stringify(sessions));
          }
        }
      }
    } catch (error) {
      console.error('Error in chat submission:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your request';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="bg-muted/20 py-3 border-b">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Drug Interaction Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              Thinking...
            </div>
          </div>
        )}
      </CardContent>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about drug interactions..."
            className="flex-1 p-2 border rounded-md"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </Card>
  );
} 