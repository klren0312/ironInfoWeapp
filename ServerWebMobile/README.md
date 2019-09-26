# tlgc

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### 使用相关库

 - "vue": "^2.6.6",
 - "vue-router": "^3.0.1",
 - "vuex": "^3.0.1",
 - "axios": "^0.18.0",
 - "echarts": "^4.1.0",
 - "element-ui": "^2.5.4",
 - "normalize.css": "^8.0.1",
 - "nprogress": "^0.2.0",
 - "sortablejs": "^1.8.3",
 - "v-charts": "^1.19.0",
 - "vm-markdown": "^0.2.8",
 - "zstorage": "^1.0.4"

### 注意:
1. api全部封装在`src\api`中, 每个页面一个`*.api.js`
2. 后端地址配在`public\index.html`
3. 登录态维护使用`localStorage`