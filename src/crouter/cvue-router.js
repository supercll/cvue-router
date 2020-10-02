const Vue; // 声明一个全局变量，存储构造函数，VueRouter中要用

class VueRouter {
    constructor(options) {
        this.$options = options
    }
}

// 插件：实现install方法，注册$router
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
    })

}