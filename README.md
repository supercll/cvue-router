# vue-router源码实现

Vue Router 是 Vue.js 官⽅的路由管理器。
它和 Vue.js 的核⼼深度集成，让构建单⻚⾯应⽤变得容易
单⻚⾯应⽤程序中，url发⽣变化时候，不能刷新，显示对应视图内容
# 需求分析

1. spa ⻚⾯不能刷新
1. hash模式： #/about
1. History模式 api /about
1. 根据url显示对应的内容
1. router-view
1. 数据响应式：current变量持有url地址，⼀旦变化，动态重新执⾏render

# vue-router的基本使用

1. 安装vue-router插件
```javascript
import Router from 'vue-router'
Vue.use(Router)
```

2. 创建Router实例
```javascript
export default new Router({...})
```

3. 在根组件添加Router实例
```javascript
import router from './router'
new Vue({
 router,
}).$mount("#app");
```

4. 添加路由视图
```vue
<router-view></router-view
```

5. 添加路由导航
```vue
<router-link to="/">Home</router-link>
<router-link to="/about">About</router-link>
```

6. 使用路由信息
```javascript
this.$router.push('/')
this.$router.push('/about'
```
# 插件的实现
## use方法的过程

1. 调用install方法
1. 给vue原型挂载插件属性
1. 注册需要的组件
## 创建VueRouter类和install⽅法
```javascript
const Vue; // 声明一个全局变量，存储构造函数，VueRouter中要用

class VueRouter {
    constructor(options) {
        this.$options = options
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
    })

}
```
### 为什么要使用混入mixin？
主要原因是use方法执行在Router实例创建之前，⽽install逻辑⼜需要⽤到该实例，所以作用就是延迟逻辑到router创建完毕并且挂载到选项时才执行use
### 为什么只有根组件有router选项？
当根组件具备router的时候，才会将这个组件的所有实例都赋予路由信息（赋给vue的原型）
### 为什么需要全局变量Vue




## 实现全局组件router-link、router-view
### router-link
```javascript
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
```


### 监控**url**变化
```javascript
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
```
### router-view动态获取路由对应组件
```javascript
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
```
如何将数据与视图变为响应式的？
### 利用 Vue.util.defineReactive方法将路由数据变为响应式


```javascript
class VueRouter {
    constructor(options) {
        // 保存当前选项
        this.$options = options;
        const initial = window.location.hash.slice(1) || "/";
        Vue.util.defineReactive(this, "current", initial);
        window.addEventListener("hashchange", () => {
            console.log(this.current);
            this.current = window.location.hash.slice(1);
        });
    }
```
### 要点

1. router-link组件中使用this.$slots.default插入对应路由
1. 利用hashchange监听路由变化
1. router-view动态获取对应组件
1. 利用**Vue.util.defineReactive**将路由属性变为响应式属性
