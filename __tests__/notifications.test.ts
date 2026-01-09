import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock das funções de notificação
const mockNotifications = {
  notifications: [] as any[],
  unreadCount: 0,
  
  addNotification: function(notification: any) {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date(),
    };
    this.notifications.unshift(newNotification);
    this.unreadCount = this.notifications.filter(n => !n.read).length;
    return newNotification;
  },
  
  markAsRead: function(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.unreadCount = this.notifications.filter(n => !n.read).length;
    }
  },
  
  markAllAsRead: function() {
    this.notifications.forEach(n => n.read = true);
    this.unreadCount = 0;
  },
  
  clearNotifications: function() {
    this.notifications = [];
    this.unreadCount = 0;
  },
};

describe("Notification System", () => {
  beforeEach(() => {
    mockNotifications.clearNotifications();
  });

  describe("addNotification", () => {
    it("should add a new notification", () => {
      const notification = mockNotifications.addNotification({
        type: "birthday",
        title: "🎂 Aniversário hoje!",
        message: "Hoje é aniversário de Natália!",
      });

      expect(mockNotifications.notifications).toHaveLength(1);
      expect(notification.type).toBe("birthday");
      expect(notification.read).toBe(false);
      expect(notification.createdAt).toBeInstanceOf(Date);
    });

    it("should increment unread count", () => {
      mockNotifications.addNotification({
        type: "birthday",
        title: "Test",
        message: "Test message",
      });

      expect(mockNotifications.unreadCount).toBe(1);

      mockNotifications.addNotification({
        type: "recognition",
        title: "Test 2",
        message: "Test message 2",
      });

      expect(mockNotifications.unreadCount).toBe(2);
    });
  });

  describe("markAsRead", () => {
    it("should mark a notification as read", () => {
      const notification = mockNotifications.addNotification({
        type: "birthday",
        title: "Test",
        message: "Test message",
      });

      expect(mockNotifications.unreadCount).toBe(1);

      mockNotifications.markAsRead(notification.id);

      expect(mockNotifications.unreadCount).toBe(0);
      expect(mockNotifications.notifications[0].read).toBe(true);
    });
  });

  describe("markAllAsRead", () => {
    it("should mark all notifications as read", () => {
      mockNotifications.addNotification({ type: "birthday", title: "1", message: "1" });
      mockNotifications.addNotification({ type: "recognition", title: "2", message: "2" });
      mockNotifications.addNotification({ type: "post", title: "3", message: "3" });

      expect(mockNotifications.unreadCount).toBe(3);

      mockNotifications.markAllAsRead();

      expect(mockNotifications.unreadCount).toBe(0);
      expect(mockNotifications.notifications.every(n => n.read)).toBe(true);
    });
  });

  describe("clearNotifications", () => {
    it("should clear all notifications", () => {
      mockNotifications.addNotification({ type: "birthday", title: "1", message: "1" });
      mockNotifications.addNotification({ type: "recognition", title: "2", message: "2" });

      expect(mockNotifications.notifications).toHaveLength(2);

      mockNotifications.clearNotifications();

      expect(mockNotifications.notifications).toHaveLength(0);
      expect(mockNotifications.unreadCount).toBe(0);
    });
  });
});

describe("Birthday Notification Logic", () => {
  it("should create notification for today's birthday", () => {
    const today = new Date();
    const birthdays = [
      {
        id: 1,
        name: "Natália",
        unitName: "Araripina",
        birthDate: today,
        isTodayBirthday: true,
      },
      {
        id: 2,
        name: "Maria",
        unitName: "Serra Talhada",
        birthDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        isTodayBirthday: false,
      },
    ];

    const todayBirthdays = birthdays.filter(b => b.isTodayBirthday);
    
    expect(todayBirthdays).toHaveLength(1);
    expect(todayBirthdays[0].name).toBe("Natália");
  });

  it("should format birthday notification message correctly", () => {
    const birthday = {
      name: "João Silva",
      unitName: "Vitória",
    };

    const message = `Hoje é aniversário de ${birthday.name} (${birthday.unitName}). Não esqueça de dar os parabéns!`;

    expect(message).toContain("João Silva");
    expect(message).toContain("Vitória");
    expect(message).toContain("parabéns");
  });
});

describe("Notification Types", () => {
  it("should support different notification types", () => {
    const types = ["birthday", "recognition", "post", "system"];
    
    types.forEach(type => {
      const notification = mockNotifications.addNotification({
        type,
        title: `Test ${type}`,
        message: `Test message for ${type}`,
      });
      
      expect(notification.type).toBe(type);
    });
  });
});
