import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppAuth, AppUser } from "./auth-context";

export interface Post {
  id: number;
  authorId: number;
  authorName: string;
  authorRole: string;
  authorUnit: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  category: string; // unidade/time
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: Date;
}

export interface Comment {
  id: number;
  postId: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: number;
  name: string;
  isGroup: boolean;
  participants: { id: number; name: string }[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: Date;
}

export interface Recognition {
  id: number;
  senderId: number;
  senderName: string;
  senderUnit: string;
  receiverId: number;
  receiverName: string;
  receiverUnit: string;
  type: "parabens" | "obrigado" | "destaque";
  message?: string;
  createdAt: Date;
}

export interface FileItem {
  id: number;
  name: string;
  mimeType: string;
  isFolder: boolean;
  parentId: number | null;
  unitId: number;
  accessLevel: "all" | "socio";
  driveUrl?: string;
}

interface DataContextType {
  posts: Post[];
  conversations: Conversation[];
  recognitions: Recognition[];
  files: FileItem[];
  allUsers: { id: number; name: string; unitName: string; appRole: string }[];
  addPost: (content: string, imageUrl?: string) => void;
  likePost: (postId: number) => void;
  addComment: (postId: number, content: string) => void;
  getComments: (postId: number) => Comment[];
  sendMessage: (conversationId: number, content: string) => void;
  getMessages: (conversationId: number) => Message[];
  startConversation: (participantIds: number[]) => number;
  sendRecognition: (receiverId: number, type: Recognition["type"], message?: string) => void;
  getFilesForUser: (parentId: number | null) => FileItem[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const POSTS_KEY = "@grupo_one_posts";
const CONVERSATIONS_KEY = "@grupo_one_conversations";
const MESSAGES_KEY = "@grupo_one_messages";
const RECOGNITIONS_KEY = "@grupo_one_recognitions";
const COMMENTS_KEY = "@grupo_one_comments";

// Demo users list
const ALL_USERS = [
  { id: 1, name: "Priscila", unitName: "Araripina", appRole: "gerente" },
  { id: 2, name: "Sócia Araripina", unitName: "Araripina", appRole: "socio" },
  { id: 3, name: "Natália", unitName: "Serra Talhada", appRole: "gerente" },
  { id: 4, name: "Rebeca", unitName: "Serra Talhada", appRole: "socio" },
  { id: 5, name: "Maria Consultora", unitName: "Araripina", appRole: "consultora" },
  { id: 6, name: "Alice", unitName: "Garanhuns", appRole: "gerente" },
  { id: 7, name: "Raquel", unitName: "Garanhuns", appRole: "socio" },
  { id: 8, name: "Sabrina", unitName: "Cajazeiras", appRole: "gerente" },
  { id: 9, name: "Carol", unitName: "Livramento", appRole: "gerente" },
  { id: 10, name: "Ana Laura", unitName: "Muriaé", appRole: "gerente" },
];

// Demo files structure
const DEMO_FILES: FileItem[] = [
  // Araripina folders
  { id: 1, name: "Araripina", mimeType: "folder", isFolder: true, parentId: null, unitId: 1, accessLevel: "all" },
  { id: 2, name: "Materiais de Marketing", mimeType: "folder", isFolder: true, parentId: 1, unitId: 1, accessLevel: "all" },
  { id: 3, name: "Treinamentos", mimeType: "folder", isFolder: true, parentId: 1, unitId: 1, accessLevel: "all" },
  { id: 4, name: "Relatórios Estratégicos", mimeType: "folder", isFolder: true, parentId: 1, unitId: 1, accessLevel: "socio" },
  { id: 5, name: "Banner Promocional.pdf", mimeType: "application/pdf", isFolder: false, parentId: 2, unitId: 1, accessLevel: "all" },
  { id: 6, name: "Guia de Atendimento.pdf", mimeType: "application/pdf", isFolder: false, parentId: 3, unitId: 1, accessLevel: "all" },
  { id: 7, name: "Relatório Mensal.xlsx", mimeType: "application/xlsx", isFolder: false, parentId: 4, unitId: 1, accessLevel: "socio" },
  // Serra Talhada folders
  { id: 8, name: "Serra Talhada", mimeType: "folder", isFolder: true, parentId: null, unitId: 2, accessLevel: "all" },
  { id: 9, name: "Materiais de Marketing", mimeType: "folder", isFolder: true, parentId: 8, unitId: 2, accessLevel: "all" },
  { id: 10, name: "Documentos Sócios", mimeType: "folder", isFolder: true, parentId: 8, unitId: 2, accessLevel: "socio" },
];

// Initial demo posts
const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    authorId: 4,
    authorName: "Rebeca",
    authorRole: "Sócia",
    authorUnit: "Serra Talhada",
    content: "Parabéns a toda equipe pelo excelente resultado do mês! Vocês são incríveis! 🎉",
    category: "serra",
    likes: 12,
    comments: 3,
    isLiked: false,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 2,
    authorId: 1,
    authorName: "Priscila",
    authorRole: "Gerente",
    authorUnit: "Araripina",
    content: "Novo material de campanha disponível na pasta de Marketing. Confiram!",
    category: "araripina",
    likes: 8,
    comments: 1,
    isLiked: false,
    createdAt: new Date(Date.now() - 7200000),
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAppAuth();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedPosts, storedConversations, storedMessages, storedRecognitions, storedComments] = await Promise.all([
        AsyncStorage.getItem(POSTS_KEY),
        AsyncStorage.getItem(CONVERSATIONS_KEY),
        AsyncStorage.getItem(MESSAGES_KEY),
        AsyncStorage.getItem(RECOGNITIONS_KEY),
        AsyncStorage.getItem(COMMENTS_KEY),
      ]);

      if (storedPosts) {
        const parsed = JSON.parse(storedPosts);
        setPosts(parsed.map((p: Post) => ({ ...p, createdAt: new Date(p.createdAt) })));
      }
      if (storedConversations) {
        const parsed = JSON.parse(storedConversations);
        setConversations(parsed.map((c: Conversation) => ({
          ...c,
          lastMessageTime: c.lastMessageTime ? new Date(c.lastMessageTime) : undefined,
        })));
      }
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages);
        setMessages(parsed.map((m: Message) => ({ ...m, createdAt: new Date(m.createdAt) })));
      }
      if (storedRecognitions) {
        const parsed = JSON.parse(storedRecognitions);
        setRecognitions(parsed.map((r: Recognition) => ({ ...r, createdAt: new Date(r.createdAt) })));
      }
      if (storedComments) {
        const parsed = JSON.parse(storedComments);
        setComments(parsed.map((c: Comment) => ({ ...c, createdAt: new Date(c.createdAt) })));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const saveData = async (key: string, data: unknown) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const addPost = (content: string, category: string = "geral") => {
    if (!user) return;

    const newPost: Post = {
      id: Date.now(),
      authorId: user.id,
      authorName: user.name,
      authorRole: user.appRole === "socio" ? "Sócio(a)" : user.appRole === "gerente" ? "Gerente" : "Consultora",
      authorUnit: user.unitNames?.[0] || "Grupo ONE",
      authorAvatar: user.photoUrl,
      content,
      category,
      likes: 0,
      comments: 0,
      isLiked: false,
      createdAt: new Date(),
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    saveData(POSTS_KEY, updated);
  };

  const likePost = (postId: number) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    });
    setPosts(updated);
    saveData(POSTS_KEY, updated);
  };

  const addComment = (postId: number, content: string) => {
    if (!user) return;

    const newComment: Comment = {
      id: Date.now(),
      postId,
      authorId: user.id,
      authorName: user.name,
      content,
      createdAt: new Date(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    saveData(COMMENTS_KEY, updatedComments);

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return { ...post, comments: post.comments + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
    saveData(POSTS_KEY, updatedPosts);
  };

  const getComments = (postId: number) => {
    return comments.filter((c) => c.postId === postId);
  };

  const sendMessage = (conversationId: number, content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: Date.now(),
      conversationId,
      senderId: user.id,
      senderName: user.name,
      content,
      createdAt: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveData(MESSAGES_KEY, updatedMessages);

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: content,
          lastMessageTime: new Date(),
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
    saveData(CONVERSATIONS_KEY, updatedConversations);
  };

  const getMessages = (conversationId: number) => {
    return messages.filter((m) => m.conversationId === conversationId);
  };

  const startConversation = (participantIds: number[]) => {
    if (!user) return -1;

    const allParticipantIds = [...new Set([user.id, ...participantIds])];
    const participants = allParticipantIds.map((id) => {
      const u = ALL_USERS.find((u) => u.id === id);
      return { id, name: u?.name || "Usuário" };
    });

    const newConversation: Conversation = {
      id: Date.now(),
      name: participants.filter((p) => p.id !== user.id).map((p) => p.name).join(", "),
      isGroup: participants.length > 2,
      participants,
      unreadCount: 0,
    };

    const updated = [newConversation, ...conversations];
    setConversations(updated);
    saveData(CONVERSATIONS_KEY, updated);

    return newConversation.id;
  };

  const sendRecognition = (receiverId: number, type: Recognition["type"], message?: string) => {
    if (!user) return;

    const receiver = ALL_USERS.find((u) => u.id === receiverId);
    if (!receiver) return;

    const newRecognition: Recognition = {
      id: Date.now(),
      senderId: user.id,
      senderName: user.name,
      senderUnit: user.unitNames?.[0] || "Grupo ONE",
      receiverId,
      receiverName: receiver.name,
      receiverUnit: receiver.unitName,
      type,
      message,
      createdAt: new Date(),
    };

    const updated = [newRecognition, ...recognitions];
    setRecognitions(updated);
    saveData(RECOGNITIONS_KEY, updated);
  };

  const getFilesForUser = (parentId: number | null) => {
    if (!user) return [];

    return DEMO_FILES.filter((file) => {
      // Filter by parent
      if (file.parentId !== parentId) return false;

      // Root level: show only user's unit folder
      if (parentId === null) {
        return user.unitIds?.includes(file.unitId) || false;
      }

      // Check access level
      if (file.accessLevel === "socio" && user.appRole !== "socio") {
        return false;
      }

      // Check unit access
      if (!user.unitIds?.includes(file.unitId)) return false;

      return true;
    });
  };

  return (
    <DataContext.Provider
      value={{
        posts,
        conversations,
        recognitions,
        files: DEMO_FILES,
        allUsers: ALL_USERS,
        addPost,
        likePost,
        addComment,
        getComments,
        sendMessage,
        getMessages,
        startConversation,
        sendRecognition,
        getFilesForUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
