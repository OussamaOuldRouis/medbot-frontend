interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  drugs?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: string;
}

export const addChatMessage = (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
  try {
    console.log('Adding chat message:', { sessionId, message }); // Debug log

    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    // Get existing sessions
    const existingSessions = localStorage.getItem('chatSessions');
    console.log('Existing sessions from localStorage:', existingSessions); // Debug log
    
    let sessions: ChatSession[] = existingSessions ? JSON.parse(existingSessions) : [];

    // Find or create session
    let session = sessions.find(s => s.id === sessionId);
    if (!session) {
      console.log('Creating new session:', sessionId); // Debug log
      session = {
        id: sessionId,
        title: `Chat ${new Date().toLocaleDateString()}`,
        messages: [],
        timestamp: new Date().toISOString()
      };
      sessions.push(session);
    }

    // Add message to session
    session.messages.push(newMessage);
    session.timestamp = new Date().toISOString();

    // Update title if it's the default one and we have drugs mentioned
    if (session.title.startsWith('Chat ') && newMessage.drugs && newMessage.drugs.length > 0) {
      session.title = `Chat about ${newMessage.drugs.join(', ')}`;
    }

    // Save back to localStorage
    const sessionsToStore = JSON.stringify(sessions);
    console.log('Saving sessions to localStorage:', sessionsToStore); // Debug log
    localStorage.setItem('chatSessions', sessionsToStore);

    // Verify storage
    const storedSessions = localStorage.getItem('chatSessions');
    console.log('Verified stored sessions:', storedSessions); // Debug log

    return true;
  } catch (error) {
    console.error('Error saving chat message:', error);
    return false;
  }
};

export const getChatSessions = (): ChatSession[] => {
  try {
    const storedSessions = localStorage.getItem('chatSessions');
    console.log('Getting chat sessions from localStorage:', storedSessions); // Debug log
    
    if (!storedSessions) {
      console.log('No stored sessions found'); // Debug log
      return [];
    }

    const sessions = JSON.parse(storedSessions);
    if (!Array.isArray(sessions)) {
      console.error('Stored sessions is not an array:', sessions); // Debug log
      return [];
    }

    // Sort sessions by timestamp (newest first)
    const sortedSessions = sessions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    console.log('Sorted sessions:', sortedSessions); // Debug log
    return sortedSessions;
  } catch (error) {
    console.error('Error getting chat sessions:', error);
    return [];
  }
};

export const getChatSession = (sessionId: string): ChatSession | null => {
  try {
    console.log('Getting chat session:', sessionId); // Debug log
    const sessions = getChatSessions();
    const session = sessions.find(s => s.id === sessionId) || null;
    console.log('Found session:', session); // Debug log
    return session;
  } catch (error) {
    console.error('Error getting chat session:', error);
    return null;
  }
};

export const deleteChatSession = (sessionId: string): boolean => {
  try {
    console.log('Deleting chat session:', sessionId); // Debug log
    const sessions = getChatSessions();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem('chatSessions', JSON.stringify(filteredSessions));
    console.log('Sessions after deletion:', filteredSessions); // Debug log
    return true;
  } catch (error) {
    console.error('Error deleting chat session:', error);
    return false;
  }
}; 