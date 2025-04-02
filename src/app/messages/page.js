'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSearchParams } from 'next/navigation';

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
      const response = await fetch('/api/messages/conversations');
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
      console.error('Erreur:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await fetch(`/api/messages/${otherUserId}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des messages');
      }
      const data = await response.json();
      const sortedMessages = data.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || !selectedUser) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          receiverId: parseInt(selectedUser.userId)
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
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
      console.error('Erreur:', error);
      setError(error.message);
    }
  };

  const handleUserSelect = (conversation) => {
    setSelectedUser(conversation);
    fetchMessages(conversation.userId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            Veuillez vous connecter pour accéder à vos messages.
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-3 min-h-[600px]">
            {/* Liste des conversations */}
            <div className="col-span-1 border-r">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Conversations</h2>
              </div>
              <div className="overflow-y-auto h-[calc(600px-4rem)]">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Aucune conversation
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.userId}
                      onClick={() => handleUserSelect(conversation)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedUser?.userId === conversation.userId
                          ? 'bg-blue-50'
                          : ''
                      }`}
                    >
                      <div className="font-medium">{conversation.userName}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(conversation.lastMessageDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Zone de messages */}
            <div className="col-span-2 flex flex-col">
              {selectedUser ? (
                <>
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">
                      Discussion avec {selectedUser.userName}
                    </h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                      const isCurrentUserMessage = message.senderId === currentUserId;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isCurrentUserMessage ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isCurrentUserMessage
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p>{message.content}</p>
                            <div
                              className={`text-xs mt-1 ${
                                isCurrentUserMessage
                                  ? 'text-blue-100'
                                  : 'text-gray-500'
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Votre message..."
                        required
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Envoyer
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Sélectionnez une conversation pour commencer à discuter
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}