'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Composant client qui utilise useSearchParams
function MessagesClient() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('userId');

  useEffect(() => {
    // Importer socket.io-client dynamiquement pour éviter les problèmes côté serveur
    const initSocket = async () => {
      if (typeof window !== 'undefined' && user && !socket) {
        const { io } = await import('socket.io-client');
        const newSocket = io('http://localhost:3000', {
          path: '/api/socketio',
          transports: ['websocket'],
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          autoConnect: true,
          timeout: 20000
        });

        newSocket.on('connect', () => {
          console.log('Connected to WebSocket');
          newSocket.emit('authenticate', user.id);
        });

        newSocket.on('conversations', (data) => {
          console.log('Received conversations:', data);
          setConversations(Array.isArray(data) ? data : []);
        });

        newSocket.on('messages', (receivedMessages) => {
          console.log('Received messages:', receivedMessages);
          const sortedMessages = receivedMessages.sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
          );
          setMessages(sortedMessages);
        });

        newSocket.on('messageSent', (message) => {
          console.log('Message sent:', message);
          if (selectedUser && 
              (message.senderId === selectedUser.userId || 
               message.receiverId === selectedUser.userId)) {
            setMessages(prev => [...prev, message].sort((a, b) => 
              new Date(a.createdAt) - new Date(b.createdAt)
            ));
          }
          updateConversationWithNewMessage(message, newSocket);
        });

        newSocket.on('messageReceived', (message) => {
          console.log('Message received:', message);
          if (selectedUser && 
              (message.senderId === selectedUser.userId || 
               message.receiverId === selectedUser.userId)) {
            setMessages(prev => [...prev, message].sort((a, b) => 
              new Date(a.createdAt) - new Date(b.createdAt)
            ));
          }
          updateConversationWithNewMessage(message, newSocket);
        });

        newSocket.on('error', (error) => {
          console.error('Erreur WebSocket:', error);
          setError(error.message);
        });

        setSocket(newSocket);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [user, selectedUser]);

  const updateConversationWithNewMessage = (message, currentSocket) => {
    if (!user) return;
    
    setConversations(prevConversations => {
      const otherUserId = message.senderId === user.id ? message.receiverId : message.senderId;
      const conversationIndex = prevConversations.findIndex(conv => 
        (conv.sender?.id === otherUserId && conv.receiver?.id === user.id) ||
        (conv.sender?.id === user.id && conv.receiver?.id === otherUserId)
      );

      const newConversations = [...prevConversations];

      if (conversationIndex !== -1) {
        newConversations[conversationIndex] = {
          ...newConversations[conversationIndex],
          content: message.content,
          createdAt: message.createdAt
        };

        if (conversationIndex > 0) {
          const [updatedConv] = newConversations.splice(conversationIndex, 1);
          newConversations.unshift(updatedConv);
        }
      }

      return newConversations;
    });
  };

  useEffect(() => {
    if (socket && selectedUser) {
      socket.emit('getMessages', { otherUserId: selectedUser.userId });
    }
  }, [selectedUser, socket]);

  useEffect(() => {
    if (initialUserId && socket && user) {
      const userId = parseInt(initialUserId);
      const existingConv = conversations.find(conv => 
        conv.sender?.id === userId || conv.receiver?.id === userId
      );
      
      if (existingConv) {
        setSelectedUser({
          userId,
          userName: existingConv.sender?.id === user.id ? existingConv.receiver?.name : existingConv.sender?.name
        });
      } else {
        socket.emit('initConversation', { userId });
      }
    }
  }, [initialUserId, socket, conversations, user]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || !selectedUser || !socket) return;

    socket.emit('sendMessage', {
      content: newMessage,
      receiverId: selectedUser.userId
    });

    setNewMessage('');
  };

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Veuillez vous connecter pour accéder à vos messages</p>
        <Link href="/login" className="text-blue-600 hover:underline">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg">
        {/* Liste des conversations */}
        <div className="w-1/3 border-r">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {conversations.map((conv) => {
              const isUserSender = conv.senderId === user.id;
              const otherUser = isUserSender ? conv.receiver : conv.sender;
              if (!otherUser) return null;
              
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedUser({ userId: otherUser.id, userName: otherUser.name })}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedUser?.userId === otherUser.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {otherUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{otherUser.name}</h3>
                      <p className="text-sm text-gray-500">
                        {conv.content?.substring(0, 30)}
                        {conv.content?.length > 30 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone de conversation */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">{selectedUser.userName}</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.senderId === parseInt(user.id) ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {/* Avatar et nom pour les messages reçus - à gauche */}
                    {message.senderId !== parseInt(user.id) && (
                      <div className="flex flex-col items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {selectedUser.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {selectedUser.userName}
                        </span>
                      </div>
                    )}

                    {/* Le message */}
                    <div
                      className={`max-w-[60%] px-4 py-2 rounded-t-lg ${
                        message.senderId === parseInt(user.id)
                          ? 'bg-blue-500 text-white rounded-l-lg rounded-br-lg'
                          : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-bl-lg'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          message.senderId === parseInt(user.id) ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Envoyer
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Sélectionnez une conversation pour commencer à discuter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant principal qui enveloppe le client dans Suspense
export default function Messages() {
  return (
    <Suspense fallback={<div className="text-center py-10">Chargement des messages...</div>}>
      <MessagesClient />
    </Suspense>
  );
}
