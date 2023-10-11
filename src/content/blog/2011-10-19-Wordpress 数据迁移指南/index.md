---
title: Wordpress 数据迁移指南
id: 922
comment: true
tags:
  - 技术
slug: wordpress-migration
created_at: 2011-10-18T23:07:42.000Z
updated_at: 2011-10-18T23:07:42.000Z
description: 这篇博客是一篇 Wordpress 数据迁移备忘录。作者提供了一些步骤来帮助读者将原始数据迁移到本地数据库中。这些步骤包括清除本地 wp 的数据表、使用插件下载原始数据、通过 phpmyadmin 导入数据、替换文章中的域名以及下载所有图片等。作者还提供了一些示例代码来帮助读者更好地理解这些步骤。最后，作者提醒读者在进行数据迁移时需要注意一些问题。
---

0:清除本地 wp 的数据表，仅保留 wp-users 表及 wp-options 表

1:使用 wp-db-back 插件下载原始数据。

2:直接通过 phpmyadmin 往本地数据库中导入如果遇到 Duplicate entry 的错误时，根据错误提示所指示的内容删除之。

3:将备份 SQL 文件中和 wp-users 表及 wp-options 表有关的 表操作语句去掉，以免覆盖本地原有的

4:将文章中所有的域名替换成本地的，防止裂图

```sql
UPDATE wp_posts SET post_content =replace(post_content,'tomyail.com/blog','localhost/wordpress');
```

5:进入网站后台下载所有图片放入本地

好吧，这文章不是指南，只是我的备忘.
