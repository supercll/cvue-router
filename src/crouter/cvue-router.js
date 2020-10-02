let Vue; // 声明一个全局变量，存储构造函数，VueRouter中要用

class VueRouter {
    constructor(options) {
        this.$options = options;
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
};

// 2. 实现全局组件router-link
vue.component("router-link", {
    props: {
        to: {
            type: String,
            required: true,
        },
    },
    render(h) {
        // 可以使用jsx，但是不推荐，因为性能低于render渲染成虚拟dom
        return h(
            "a",
            {
                attr: {
                    href: "#" + this.to,
                },
            },
            this.$slots.default
        );
    },
});

Vue.component("router-view", {
})
export default VueRouter;
