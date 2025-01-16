# 安装

## 跟 Vue 项目集成

### 1、获取安装包

```
cd ./src/shard

git clone https://github.com/3052971491/tui-uni.git
```



### 2、引入并全局注册 Tui Uni 组件

```ts
// 引入Vue
import { createApp } from "vue";
import App from "./App.vue";

// 引入Tui Uni
import registerTComponents from "@/shared/tui-uni";

// 注册
async function bootstrap() {
  const app = createApp(App);

  registerTComponents.install(app);

  app.mount("#app");
}

bootstrap();
```
