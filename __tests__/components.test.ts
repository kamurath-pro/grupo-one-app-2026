import { describe, it, expect } from "vitest";

describe("Grupo ONE App Components", () => {
  describe("ProfilePhoto Component", () => {
    it("should generate correct initials from name", () => {
      const getInitials = (name: string) => {
        return name
          .split(" ")
          .map((n) => n.charAt(0))
          .slice(0, 2)
          .join("")
          .toUpperCase();
      };

      expect(getInitials("Maria Silva")).toBe("MS");
      expect(getInitials("João")).toBe("J");
      expect(getInitials("Ana Paula Costa")).toBe("AP");
    });
  });

  describe("Post Data Structure", () => {
    it("should have correct post structure", () => {
      const post = {
        id: 1,
        authorId: 1,
        authorName: "Test User",
        authorRole: "Gerente",
        authorUnit: "Araripina",
        content: "Test content",
        category: "geral",
        likes: 0,
        comments: 0,
        isLiked: false,
        createdAt: new Date(),
      };

      expect(post).toHaveProperty("id");
      expect(post).toHaveProperty("authorName");
      expect(post).toHaveProperty("category");
      expect(post).toHaveProperty("likes");
      expect(post).toHaveProperty("isLiked");
      expect(typeof post.likes).toBe("number");
      expect(typeof post.isLiked).toBe("boolean");
    });

    it("should toggle like correctly", () => {
      const likePost = (post: { isLiked: boolean; likes: number }) => {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      };

      const post = { isLiked: false, likes: 5 };
      const likedPost = likePost(post);
      
      expect(likedPost.isLiked).toBe(true);
      expect(likedPost.likes).toBe(6);

      const unlikedPost = likePost(likedPost);
      expect(unlikedPost.isLiked).toBe(false);
      expect(unlikedPost.likes).toBe(5);
    });
  });

  describe("Portal Cards Configuration", () => {
    const PORTAL_CARDS_SOCIO = [
      { id: "documentos", title: "Documentos" },
      { id: "metricas", title: "Métricas" },
      { id: "arquivos-uteis", title: "Arquivos Úteis" },
      { id: "suporte", title: "Suporte" },
    ];

    const PORTAL_CARDS_COLABORADOR = [
      { id: "documentos", title: "Documentos" },
      { id: "suporte", title: "Suporte" },
    ];

    it("should show 4 cards for sócios", () => {
      expect(PORTAL_CARDS_SOCIO.length).toBe(4);
    });

    it("should show 2 cards for colaboradores", () => {
      expect(PORTAL_CARDS_COLABORADOR.length).toBe(2);
    });

    it("should have Documentos and Suporte for both roles", () => {
      const socioIds = PORTAL_CARDS_SOCIO.map(c => c.id);
      const colaboradorIds = PORTAL_CARDS_COLABORADOR.map(c => c.id);

      expect(socioIds).toContain("documentos");
      expect(socioIds).toContain("suporte");
      expect(colaboradorIds).toContain("documentos");
      expect(colaboradorIds).toContain("suporte");
    });
  });

  describe("Unidades (Times) Configuration", () => {
    const UNIDADES = [
      "Geral",
      "Araripina",
      "Serra Talhada",
      "Garanhuns",
      "Cajazeiras",
      "Vitória",
      "Livramento",
      "Muriaé",
      "Vilhena",
      "Corumbá",
      "Fortaleza",
      "Macaé Plaza",
      "Macaé Centro",
    ];

    it("should have 13 unidades including Geral", () => {
      expect(UNIDADES.length).toBe(13);
    });

    it("should have Geral as first option", () => {
      expect(UNIDADES[0]).toBe("Geral");
    });

    it("should include all required units", () => {
      expect(UNIDADES).toContain("Araripina");
      expect(UNIDADES).toContain("Serra Talhada");
      expect(UNIDADES).toContain("Garanhuns");
      expect(UNIDADES).toContain("Cajazeiras");
      expect(UNIDADES).toContain("Fortaleza");
      expect(UNIDADES).toContain("Macaé Plaza");
      expect(UNIDADES).toContain("Macaé Centro");
    });
  });

  describe("Time Formatting", () => {
    it("should format time ago correctly", () => {
      const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}min`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
      };

      const now = new Date();
      
      // 30 minutes ago
      const thirtyMinAgo = new Date(now.getTime() - 30 * 60000);
      expect(formatTimeAgo(thirtyMinAgo)).toBe("30min");

      // 2 hours ago
      const twoHoursAgo = new Date(now.getTime() - 2 * 3600000);
      expect(formatTimeAgo(twoHoursAgo)).toBe("2h");

      // 3 days ago
      const threeDaysAgo = new Date(now.getTime() - 3 * 86400000);
      expect(formatTimeAgo(threeDaysAgo)).toBe("3d");
    });
  });
});
