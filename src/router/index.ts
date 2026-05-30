import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/RegisterView.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "app-layout" */ '@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import(/* webpackChunkName: "dashboard" */ '@/views/DashboardView.vue'),
        },
        {
          path: 'kategori',
          name: 'kategori',
          component: () => import(/* webpackChunkName: "kategori" */ '@/views/KategoriView.vue'),
          meta: { roles: ['ADMIN', 'PETUGAS'] },
        },
        {
          path: 'barang',
          name: 'barang',
          component: () => import(/* webpackChunkName: "barang" */ '@/views/BarangView.vue'),
        },
        {
          path: 'users',
          name: 'users',
          component: () => import(/* webpackChunkName: "users" */ '@/views/UsersView.vue'),
          meta: { roles: ['ADMIN'] },
        },
        {
          path: 'peminjaman',
          name: 'peminjaman',
          component: () => import(/* webpackChunkName: "peminjaman" */ '@/views/PeminjamanView.vue'),
        },
        {
          path: 'peminjaman/:id',
          name: 'peminjaman-detail',
          component: () => import(/* webpackChunkName: "peminjaman-detail" */ '@/views/PeminjamanDetailView.vue'),
        },
        {
          path: 'detail-peminjaman/:id',
          name: 'detail-peminjaman',
          component: () => import(/* webpackChunkName: "detail-peminjaman" */ '@/views/DetailPeminjamanView.vue'),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  const roles = to.meta.roles as string[] | undefined
  if (roles?.length && auth.user && !roles.includes(auth.user.role)) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
