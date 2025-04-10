'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import PageLayout from '../../components/PageLayout';

function MessagesContent() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('userId');
  const currentUserId = parseInt(user?.id);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (initialUserId && !selectedUser) {
      const conversation = conversations.find(conv => conv.userId === parseInt(initialUserId));
      if (conversation) {
        setSelectedUser(conversation);
        fetchMessages(parseInt(initialUserId));
      }
    }
  }, [initialUserId, conversations]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des conversations');
      }
      const data = await response.json();
      const sortedConversations = data.sort((a, b) => 
        new Date(b.lastMessageDate) - new Date(a.lastMessageDate)
      );
      setConversations(sortedConversations);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await fetch(`/api/messages/${otherUserId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des messages');
      }
      const data = await response.json();
      const sortedMessages = data.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      );
      setMessages(sortedMessages);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || !selectedUser) return;

    try {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) {
        throw new Error('Aucun message trouvé dans cette conversation');
      }

      const messageData = {
        content: newMessage,
        receiverId: parseInt(selectedUser.userId),
        ...(lastMessage.adId && { adId: lastMessage.adId })
      };

      const response = await fetch('/api/messages', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'envoi du message');
      }

      const message = await response.json();
      const newMessageWithDetails = {
        ...message,
        senderId: currentUserId,
        receiverId: parseInt(selectedUser.userId),
      };
      setMessages(prev => [...prev, newMessageWithDetails]);
      setNewMessage('');
      
      fetchConversations();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUserSelect = (conversation) => {
    setSelectedUser(conversation);
    fetchMessages(conversation.userId);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-white/60">Veuillez vous connecter pour accéder à vos messages.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border border-white/20 border-t-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 min-h-[600px] border border-white/10">
      {/* Liste des conversations */}
      <div className="col-span-1 border-r border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-sm font-light tracking-wide">CONVERSATIONS</h2>
        </div>
        <div className="overflow-y-auto h-[calc(600px-4rem)]">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-white/60">
              Aucune conversation
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.userId}
                onClick={() => handleUserSelect(conversation)}
                className={`p-4 border-b border-white/10 cursor-pointer transition-colors ${
                  selectedUser?.userId === conversation.userId
                    ? 'bg-white/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="font-light">{conversation.userName}</div>
                <div className="text-sm text-white/60 truncate mt-1">
                  {conversation.lastMessage}
                </div>
                <div className="text-xs text-white/40 mt-1">
                  {new Date(conversation.lastMessageDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Zone des messages */}
      <div className="col-span-2 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-light tracking-wide">
                CONVERSATION AVEC {selectedUser.userName.toUpperCase()}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 ${
                      message.senderId === currentUserId
                        ? 'bg-white/10'
                        : 'bg-white/5'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-white/40 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Votre message..."
                  className="flex-1 bg-black border border-white/20 p-3 text-sm focus:outline-none focus:border-white/50 transition-colors"
                />
                <button
                  type="submit"
                  className="border border-white/20 px-6 text-sm hover:bg-white hover:text-black transition-colors duration-300"
                >
                  ENVOYER
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/60">
            Sélectionnez une conversation
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <PageLayout>
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border border-white/20 border-t-white"></div>
        </div>
      }>
        <MessagesContent />
      </Suspense>
    </PageLayout>
  );
}