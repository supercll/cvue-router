let Vue; // 声明一个全局变量，存储构造函数，VueRouter中要用

class VueRouter {
    constructor(options) {
        // 保存当前选项
        this.$options = options;
        this.current = "/";
        window.addEventListener("hashchange", () => {
            console.log(this.current);
            this.current = window.location.hash.slice(1);
        });
    }
}

// 插件：实现install方法，注册$router
// 为什么要⽤混⼊⽅式写？主要原因是use方法执行在Router实例创建之前，⽽install逻辑⼜需要⽤到该实例
VueRouter.install = function(_Vue) {
    // 引用构造函数，VueRouter中使用
    Vue = _Vue;

    // 1. 挂载$router
    Vue.mixin({
        beforeCreate() {
            // 只有根组件有router选项
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router;
            }
        },
    });

    // 2.注册实现两个组件router-view,router-link
    Vue.component("router-link", {
        props: {
            to: {
                type: String,
                required: true,
            },
        },
        render(h) {
            // <a href="to">xxx</a>
            // return <a href={'#'+this.to}>{this.$slots.default}</a>
            return h(
                "a",
                {
                    attrs: {
                        href: "#" + this.to,
                    },
                },
                this.$slots.default
            );
        },
    });
    Vue.component("router-view", {
        render(h) {
            // 获取当前路由对应的组件
            let component = null;
            const route = this.$router.$options.routes.find(
                route => route.path === this.$router.current
            );
            if (route) {
                component = route.component;
            }
            console.log(this.$router.current, component);

            return h(component);
        },
    });
};

export default VueRouter;
