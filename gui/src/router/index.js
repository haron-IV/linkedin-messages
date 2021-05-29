import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Bot from "../views/Bot";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Bor",
    component: Bot,
  },
  {
    path: "/bot",
    name: "Bot",
    component: Bot,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
