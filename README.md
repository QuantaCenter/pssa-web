# pssa-web

## Project brief
该项目为广外培训学时系统网页端，通过[**yarn**](https://classic.yarnpkg.com/en/)进行管理，基于**vue-cli**构建，整体技术栈为**vue2 + ts** （PS: 仅ts文件用到，而且用法比较低级，基本上都是anyscript）

下面是项目中比较重要的库，这里列出相关文档地址，在查阅时要注意版本的问题

- vue https://v2.vuejs.org/
  - vue-router https://v3.router.vuejs.org/
  - vue-cli https://cli.vuejs.org/
- axios https://axios-http.com/docs/intro
- element-ui https://element.eleme.io/#/zh-CN
- xlsx https://sheetjs.com/

其余库主要用于项目构建，基本可以不作改动

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

## Project structure

由于项目结构简单，且由于页面数量少，这里仅列出主要部分
```yaml
- api 请求
- components 组件
- common 静态数据
- assets 资源
- router 路由
- style 样式
- views 页面视图
```

## todo
- views/Attend 和 views/AttendDetail 两个页面还没有接上接口，后续可以和后台同学沟通一下，完成这部分 [ high ]
- 基于现有结构优化 or 升级技术栈 [nice to have]