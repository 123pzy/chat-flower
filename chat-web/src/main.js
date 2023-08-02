import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./routes";
import { createPinia } from "pinia";
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-notification.css";
import "element-plus/theme-chalk/el-message-box.css";
import "element-plus/theme-chalk/el-drawer.css";

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount("#app");
