---
title: react-router 升级填坑记录
tags:
  - 技术
  - JavaScript
  - React
slug: react-router-migration
created_at: 2017-08-27T22:27:14.000Z
updated_at: 2017-08-27T22:27:14.000Z
description: 一篇关于从 React-Router 3 升级到 4 版本的博客文章。作者记录了在升级过程中遇到的一些问题和解决方案。文章介绍了 React-Router 4 版本相对于 3 版本的一些变化，包括去掉了钩子函数，路由匹配后直接渲染对应的组件等。作者还提到了一些在升级过程中需要注意的问题，如路由的动态匹配规则和 querystring 的变化等。文章最后给出了一个更好的解决方案，即改变程序的启动逻辑，将前置数据准备和 querystring 判断放在 BootstrapLoader 组件里面，在其判断结束后给 state 树上面的 isAppReady 设置为 true，之后走路由的匹配规则
---

最近项目从 React-Router 3 升级到 4 版本,经历了一堆坑,但是也加深了对 router 的理解.由于[官网](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/migrating.md)的迁移文档毫无诚意,所以写篇博客记录下.

ReactRouter3 升级到 4,个人觉得最大的变化是去掉了钩子函数,当匹配到路由规则后,直接渲染对应的组件.

```text
                  onEnter
v3  match route +----------> render component

v4  match route +----------> render component
```

在 v3 里面,当路径匹配之后, `Route` 会首先触发其 `onEnter` 钩子,在这个钩子里面,我们可以做一些自己的业务逻辑,比如获取用户数据,鉴权等操作, **我们可以等这些异步操作完成之后调用回调函数,等回调函数触发后才会渲染目标组件**,换句话说如果没有触发 `onEnter` 的回调函数,所有对应的路由组件都不会 mount 渲染.

<!-- more -->

然而在 v4 里面, `Route` 的这些 on\* 钩子都被去掉了. 当路径被匹配到之后,关联的路由组件直接 mount 渲染. 我们可以把之前的 `onEnter` 逻辑放到这个组件的 `componentWillMount` 或者 `componentDidMount` 里面.

举个例子,原先设计的程序逻辑是在启动的时候加载必要的 db 和语言包数据, 然后根据 queryString 和 路径跳到不同的页面, 启动没有完成页面显示 loading . 对应的路由表录下:

| 路径       | 组件 |
| ---------- | ---- |
| /          | Home |
| /user      | User |
| /user/list | List |
| /auth      | Auth |

在 V3 版本里面代码大致是这样的:

```javascript
<Route path="/" component={Home} onEnter={startup}>
  <Route path="users" components={User}>
    <Route path="list" component={List} />k
  </Route>
  <Route path="auth" components={Auth} />
</Route>
```

当路由匹配到 `/users/list` 后,先调用 `/` 的钩子 `startup` , 然后调用 `users` 的钩子,最后调用 `list` 的钩子,任何前置钩子没有执行完毕,后续的关联组件 ( `Home -> User -> Liist` ) 都不会 `mount`,

然而切换到 v4 版本,代码思路要变,因为当路由匹配到 `/users/list` 后,( `Home -> User -> Liist` )直接 `mount`并且渲染,当这些组件里面用到了一些全局的数据比如语言包时,就会发生空对象报错.

去 github 搜了一下,真有人反映这种[问题](https://github.com/ReactTraining/react-router/issues/3854),解放方法就是用高阶组件在真实的渲染组件和路由组件之间插一层判断:[1](https://github.com/ReactTraining/react-router/issues/3854#issuecomment-301302953),不过这样的话需要在所有子组件里面都插入( Home,User,List),太繁琐了.

更好的解决方案可能是改 app 的启动逻辑,改成类似如下的代码:

```javascript
import { Route, withRouter } from 'react-router';
function mapStateToProps(state) {
  return {
    isAppReady: state.config.isAppReady,
  };
}

@withRouter
@connect(mapStateToProps)
export default class AppRoute extends Component {
  render() {
    if (this.props.isAppReady) {
      return (
        <App>
          <Route path="/users" component={User}>
            <Route path="/users/list" component={List} />
          </Route>
        </App>
      );
    }
    return <BootstrapLoader />;
  }
}
```

程序启动前的前置数据准备,querystring 判断全放在`BootstrapLoader`组件里面,在其判断结束给 state 树上面的 `isAppReady` 设置为 `true`, 之后走路由的匹配规则.

注意 withRouter 和 redux 的 connect 调用的先后次序,详见[这里](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md#important-note)

所以说, v3 的路由设计思路是静态的,匹配路由后,先判断,再渲染. v4 的设计思路是动态的,匹配路由后,先渲染组件再说,至于这个组件需要怎样的业务逻辑,这个组件自己关心去.v4 的这种模式,可以把路由的匹配规则写到任意的视图组件上面,只要路由一匹配,视图对应的部分就会自动渲染.

另外 v4 版本的路由全部是动态的,所以 path 必须写完整,如果想和 v3 那样自动是相对路由,可以这么写:

```javascript
import { Route, withRouter } from 'react-router';
function mapStateToProps(state) {
  return {
    isAppReady: state.config.isAppReady,
  };
}

@withRouter
@connect(mapStateToProps)
export default class AppRoute extends Component {
  render() {
    if (this.props.isAppReady) {
      return (
        <App>
          <Route path="/users" component={UserRoute} />
        </App>
      );
    }
    return <BootstrapLoader />;
  }
}

const UserRoute = ({ match }) => {
  return (
    <div>
      {/*  必须要有 html 元素包围 route */}
      <Route path={`${match.url}/`} exact component={UserIndex}>
        {' '}
        {/*使用 match 动态匹配 */}
        <Route path={`${match.url}/lists`} component={List} />
      </Route>
    </div>
  );
};
```

其他踩过的坑:

1.  v4 版本[去掉了 querystring](https://github.com/ReactTraining/react-router/issues/4410), 只能使用 search,如果想兼容老的,可以参考[这里](https://github.com/ReactTraining/react-router/issues/4410#issuecomment-296454485) .不过 v3 版本的 query 本来也比较坑,无法解析数组,需要使用 `qs` 库.
2.  如果你使用 `react-router-redux`,请把之前对 state 树上 `locationBeforeTransitions` 的引用改成 `location` .
