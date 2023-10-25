import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import WorkspaceView from "../views/WorkspaceView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ProfileView from "../views/ProfileView.vue";

import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true, // Mark this route as requiring authentication
      },
    },
    {
      path: "/home/profile",
      name: "profile",
      component: ProfileView,
      meta: {
        requiresAuth: true, // Mark this route as requiring authentication
      },
    },
    {
      path: "/about",
      name: "about",
      component: HomeView,
    },
    {
      path: "/workspace",
      name: "workspace",
      component: WorkspaceView,
      meta: {
        requiresAuth: true, // Mark this route as requiring authentication
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const userStore = useUserStore();
    if (userStore.isAuthenticated) {
      // 用户已登录，可以访问受保护的页面
      next();
    } else {
      // 用户未登录，重定向到登录页面或其他处理逻辑
      alert("请重新登录！");
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
