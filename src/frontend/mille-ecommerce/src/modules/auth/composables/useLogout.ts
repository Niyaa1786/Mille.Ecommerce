import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

export function useLogout() {
  const authStore = useAuthStore();
  const router = useRouter();

  async function handleLogout() {
    authStore.logout();
    router.push('/login');
  }

  return { handleLogout };
}
