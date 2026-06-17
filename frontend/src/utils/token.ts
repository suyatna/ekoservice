const KUNCI_TOKEN = 'eko_token';
const KUNCI_REFRESH = 'eko_refresh';

export const tokenStorage = {
  getToken: () => localStorage.getItem(KUNCI_TOKEN),
  setToken: (token: string) => localStorage.setItem(KUNCI_TOKEN, token),
  hapus: () => {
    localStorage.removeItem(KUNCI_TOKEN);
    localStorage.removeItem(KUNCI_REFRESH);
  }
};
