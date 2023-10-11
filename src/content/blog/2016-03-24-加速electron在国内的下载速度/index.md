---
title: 加速electron在国内的下载速度
tags:
  - 技术
  - Electron
slug: install-electron-slow-in-china
visible: true
created_at: 2016-03-23T19:02:30.000Z
updated_at: 2016-03-23T19:02:30.000Z
description: 这篇博客介绍了如何加速在中国下载 Electron 的过程。作者指出，在安装 Electron 时，会下载 electron-prebuilt 这个 zip 包，而该包默认被托管在 GitHub 上，因此在某些网络下下载会非常慢。为了解决这个问题，作者介绍了通过修改下载地址来加速下载的方法。作者提供了两种方式，一种是临时方式，通过在 npm install 命令前加入 ELECTRON_MIRROR 环境变量来指定下载地址；另一种是永久方式，通过修改环境变量文件来设置 ELECTRON_MIRROR 环境变量。最终，作者提醒读者在设置下载地址时，需要注意调试信息，以确认下载源是否替换成功。
---

安装 electron 的时候会下载`electron-prebuilt`,`electron-prebuilt`是一个 zip 包，默认被托管在 github 上，在某些网络下下载会非常慢。通过查看[electron-download](https://github.com/electron-userland/electron-download/blob/master/index.js)的源码和 readme 知道，其实是可以换下载地址的

```javascript
var url =
  process.env.NPM_CONFIG_ELECTRON_MIRROR ||
  process.env.ELECTRON_MIRROR ||
  opts.mirror ||
  'https://github.com/atom/electron/releases/download/v';
```

所以可以通过临时或者永久的方式传入镜像路径。

一：临时方式：

```bash
DEBUG=* ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/" npm install electron
```

加入`DEBUG=*`是为了查看调试信息，确认下载源是否替换成功。

二：永久方式：

给环境变量文件(.zshrc/.bashrc)加入环境变量值（前者对应 zsh，后者是 bash，自己看情况）

```bash
export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
```

另外某些情况下会出现安装包下载不完整导致 electron 安装失败的原因，可以尝试清除 electron 缓存。

缓存的默认地址在:

```text
$HOME/.electron
```

通过添加`ELECTRON_CUSTOM_DIR`可以自定义缓存目录，方法同上。
