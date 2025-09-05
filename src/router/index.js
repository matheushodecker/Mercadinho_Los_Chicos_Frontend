import { createRouter, createWebHistory } from "vue-router"
import useAuthStore from "@/stores/auth"

// Lazy load views for better performance
const LoginView = () => import("@/views/Login.vue")
const DashboardView = () => import("@/views/Dashboard.vue")
const ProdutosView = () => import("@/views/Produtos.vue")
const VendasView = () => import("@/views/Vendas.vue")
const CategoriasView = () => import("@/views/Categorias.vue")
const FornecedoresView = () => import("@/views/Fornecedores.vue")
const FabricantesView = () => import("@/views/Fabricantes.vue")
const RelatoriosView = () => import("@/views/Relatorios.vue")

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      requiresAuth: false,
      title: "Login - Mercadinho Los Chicos",
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    meta: {
      requiresAuth: true,
      title: "Dashboard - Mercadinho Los Chicos",
    },
  },
  {
    path: "/produtos",
    name: "Produtos",
    component: ProdutosView,
    meta: {
      requiresAuth: true,
      title: "Produtos - Mercadinho Los Chicos",
    },
  },
  {
    path: "/vendas",
    name: "Vendas",
    component: VendasView,
    meta: {
      requiresAuth: true,
      title: "Vendas - Mercadinho Los Chicos",
    },
  },
  {
    path: "/categorias",
    name: "Categorias",
    component: CategoriasView,
    meta: {
      requiresAuth: true,
      title: "Categorias - Mercadinho Los Chicos",
    },
  },
  {
    path: "/fornecedores",
    name: "Fornecedores",
    component: FornecedoresView,
    meta: {
      requiresAuth: true,
      title: "Fornecedores - Mercadinho Los Chicos",
    },
  },
  {
    path: "/fabricantes",
    name: "Fabricantes",
    component: FabricantesView,
    meta: {
      requiresAuth: true,
      title: "Fabricantes - Mercadinho Los Chicos",
    },
  },
  {
    path: "/relatorios",
    name: "Relatorios",
    component: RelatoriosView,
    meta: {
      requiresAuth: true,
      title: "Relatórios - Mercadinho Los Chicos",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
    meta: {
      title: "Página não encontrada - Mercadinho Los Chicos",
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // Check authentication status with Passage
  if (to.meta.requiresAuth) {
    // Ensure auth status is up to date
    await authStore.checkAuthStatus()

    if (!authStore.isAuthenticated) {
      next("/login")
      return
    }
  }

  // Redirect authenticated users away from login page
  if (to.path === "/login") {
    await authStore.checkAuthStatus()

    if (authStore.isAuthenticated) {
      next("/dashboard")
      return
    }
  }

  next()
})

export default router
