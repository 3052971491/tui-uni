import { App } from "vue";

const modules = import.meta.globEager("./src/**/*.vue");

const install = (app: App) => {
  Object.values(modules).forEach((element: any) => {
    if (element.default.name) {
      app.component(`T${element.default.name}`, element.default);
    }
  });
};

export default {
  install,
};
