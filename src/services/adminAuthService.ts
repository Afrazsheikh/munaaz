const ADMIN_PASSWORD_KEY = 'munaaz_admin_password';
const ADMIN_SESSION_KEY = 'munaaz_admin_session';
const DEFAULT_PASSWORD = 'munaaz2026';
const DEFAULT_EMAIL = 'admin@munaaz.com';

export interface AdminSession {
  email: string;
  loginTime: string;
}

export const adminAuthService = {
  getStoredPassword(): string {
    if (typeof window === 'undefined') return DEFAULT_PASSWORD;
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;
  },

  getAdminEmail(): string {
    return DEFAULT_EMAIL;
  },

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionStr) return false;
    try {
      const session: AdminSession = JSON.parse(sessionStr);
      return !!session.email;
    } catch {
      return false;
    }
  },

  async loginAsync(password: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password })
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          const session: AdminSession = {
            email: DEFAULT_EMAIL,
            loginTime: new Date().toISOString()
          };
          localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
        }
        return true;
      }
    } catch {
      // Fallback local login
    }
    return this.login(password);
  },

  login(password: string): boolean {
    const validPassword = this.getStoredPassword();
    if (password === validPassword) {
      if (typeof window !== 'undefined') {
        const session: AdminSession = {
          email: DEFAULT_EMAIL,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      }
      return true;
    }
    return false;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  },

  async updatePasswordAsync(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updatePassword', oldPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
        }
        return { success: true, message: data.message || 'Passcode updated successfully!' };
      } else {
        return { success: false, message: data.message || 'Update failed.' };
      }
    } catch {
      // Fallback
    }
    return this.updatePassword(oldPassword, newPassword);
  },

  updatePassword(oldPassword: string, newPassword: string): { success: boolean; message: string } {
    const current = this.getStoredPassword();
    if (oldPassword !== current) {
      return { success: false, message: 'Current passcode is incorrect.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New passcode must be at least 6 characters long.' };
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
    }
    return { success: true, message: 'Admin passcode updated successfully!' };
  }
};
