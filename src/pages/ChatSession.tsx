import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getChatSession } from '@/lib/chatHistory';

const ChatSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      return;
    }

    const loadSession = () => {
      try {
        const chatSession = getChatSession(sessionId);
        if (!chatSession) {
          setError('Chat session not found');
          return;
        }
        setSession(chatSession);
      } catch (error) {
        console.error('Error loading chat session:', error);
        setError('Failed to load chat session');
      }
    };

    loadSession();
    // Refresh every 5 seconds
    const intervalId = setInterval(loadSession, 5000);
    return () => clearInterval(intervalId);
  }, [sessionId]);

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-red-500">{error}</div>
          <button
            onClick={() => navigate('/chat-history')}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Back to Chat History
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="p-4">
          <div>Loading chat session...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="bg-muted/20 py-3 border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/chat-history')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} />
          </button>
          <CardTitle className="text-lg font-medium">
            {session.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-12rem)]">
        {session.messages.map((message: any, index: number) => (
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
              <p className="text-sm">{message.content}</p>
              {message.drugs && message.drugs.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {message.drugs.map((drug: string) => (
                    <span
                      key={drug}
                      className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                    >
                      {drug}
                    </span>
                  ))}
                </div>
              )}
              <div className="text-xs opacity-70 mt-2">
                {new Date(message.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ChatSession; 