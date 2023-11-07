declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"2011-10-19-Wordpress 数据迁移指南/index.md": {
	id: "2011-10-19-Wordpress 数据迁移指南/index.md";
  slug: "wordpress-migration";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2011-12-10-Flash的坐标精度/index.md": {
	id: "2011-12-10-Flash的坐标精度/index.md";
  slug: "flash-coordinate-accuracy";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-02-25-Stage3D的一些基本概念/index.md": {
	id: "2012-02-25-Stage3D的一些基本概念/index.md";
  slug: "stage3d-basic-concept";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-02-25-Starling框架的渲染机制/index.md": {
	id: "2012-02-25-Starling框架的渲染机制/index.md";
  slug: "starling-render-system";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-02-28-Box2D使用笔记/index.md": {
	id: "2012-02-28-Box2D使用笔记/index.md";
  slug: "box2d-usage";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-02-28-在Starling框架里使用Box2D/index.md": {
	id: "2012-02-28-在Starling框架里使用Box2D/index.md";
  slug: "using-box2d-in-starling";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-04-02-将Vim配置成Haxe的IDE/index.md": {
	id: "2012-04-02-将Vim配置成Haxe的IDE/index.md";
  slug: "vim-hexe-ide";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-06-29-使用Flash单元测试框架asunit/index.md": {
	id: "2012-06-29-使用Flash单元测试框架asunit/index.md";
  slug: "using-asunit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2013-02-25-Nape刚体研究小结/index.md": {
	id: "2013-02-25-Nape刚体研究小结/index.md";
  slug: "nape-rigid";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2013-03-14-理解Nape的Interaction/index.md": {
	id: "2013-03-14-理解Nape的Interaction/index.md";
  slug: "understanding-nape-interaction";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2013-04-06-Nape的回调系统/index.md": {
	id: "2013-04-06-Nape的回调系统/index.md";
  slug: "nape-callback";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2013-05-10-Nape的几何相关笔记(GeomPoly)/index.md": {
	id: "2013-05-10-Nape的几何相关笔记(GeomPoly)/index.md";
  slug: "nape-geompoly";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014-02-18-关于RGB和CMYK颜色模式/index.md": {
	id: "2014-02-18-关于RGB和CMYK颜色模式/index.md";
  slug: "cmyk-rgb";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014-06-14-Flash文本输入在移动设备上的差异/index.md": {
	id: "2014-06-14-Flash文本输入在移动设备上的差异/index.md";
  slug: "flash-text-mobile-difference";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2015-01-22-使用sublime记录evernote/index.md": {
	id: "2015-01-22-使用sublime记录evernote/index.md";
  slug: "using-sublime-to-update-evernote";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2015-01-30-unity 4.6关于RectTransform的一些研究/index.md": {
	id: "2015-01-30-unity 4.6关于RectTransform的一些研究/index.md";
  slug: "unity-rect-transform";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2015-08-15-理解Unity3D里的Coroutine/index.md": {
	id: "2015-08-15-理解Unity3D里的Coroutine/index.md";
  slug: "understanding-unity-coroutine";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2015-09-01-js和nodejs备忘/index.md": {
	id: "2015-09-01-js和nodejs备忘/index.md";
  slug: "js-foundation";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2015-11-04-从Wordpress迁移到Hexo/index.md": {
	id: "2015-11-04-从Wordpress迁移到Hexo/index.md";
  slug: "hexo-migrate";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2015-11-26-Redux入门/index.md": {
	id: "2015-11-26-Redux入门/index.md";
  slug: "introduction-of-redux";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2016-02-29-扯淡js和es6/index.md": {
	id: "2016-02-29-扯淡js和es6/index.md";
  slug: "thinking-about-js-and-es6";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2016-03-02-扯淡js和es6 续/index.md": {
	id: "2016-03-02-扯淡js和es6 续/index.md";
  slug: "thinking-about-js-and-es6-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2016-03-11-React的动画小结/index.md": {
	id: "2016-03-11-React的动画小结/index.md";
  slug: "react-animation";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2016-03-24-加速electron在国内的下载速度/index.md": {
	id: "2016-03-24-加速electron在国内的下载速度/index.md";
  slug: "install-electron-slow-in-china";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2016-08-28-如何有效阅读/index.md": {
	id: "2016-08-28-如何有效阅读/index.md";
  slug: "how-to-read-book";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2016-08-30-如何调试minify过的js文件/index.md": {
	id: "2016-08-30-如何调试minify过的js文件/index.md";
  slug: "debug-js-without-sourcemap";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2016-09-03-《巨人的陨落》书评/index.md": {
	id: "2016-09-03-《巨人的陨落》书评/index.md";
  slug: "fall-of-giant-review";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2016-09-04-使用travis自动部署hexo日志/index.md": {
	id: "2016-09-04-使用travis自动部署hexo日志/index.md";
  slug: "writing-hexo-blog-with-travis-ci";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2017-05-10-eslint的正确使用方式/index.md": {
	id: "2017-05-10-eslint的正确使用方式/index.md";
  slug: "eslint-with-prettier";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2017-06-14-使用 git submodule 同步主从项目的依赖关系/index.md": {
	id: "2017-06-14-使用 git submodule 同步主从项目的依赖关系/index.md";
  slug: "using-git-submodule-lock-project";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2017-06-23-如何花30分钟解决 eslint 产生的各种错误/index.md": {
	id: "2017-06-23-如何花30分钟解决 eslint 产生的各种错误/index.md";
  slug: "how-to-lint-legacy-jscode-in-30min";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2017-08-28-react-router 升级填坑记录/index.md": {
	id: "2017-08-28-react-router 升级填坑记录/index.md";
  slug: "react-router-migration";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019-10-30-从 electron 2 迁移到 5 遇到的坑/index.md": {
	id: "2019-10-30-从 electron 2 迁移到 5 遇到的坑/index.md";
  slug: "migration-from-electron-2-to-5";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-03-13-基于 s3 的单页应用的一种纯前端灰度发布实现/index.md": {
	id: "2020-03-13-基于 s3 的单页应用的一种纯前端灰度发布实现/index.md";
  slug: "a-b-testing-for-create-react-app";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-04-18-electron 集成 addon 方案简介/index.md": {
	id: "2020-04-18-electron 集成 addon 方案简介/index.md";
  slug: "introducing-node-addon-development-with-electron";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-05-28-RxJS 和响应式编程简介/index.md": {
	id: "2020-05-28-RxJS 和响应式编程简介/index.md";
  slug: "introducing-reactive-programming-with-rxjs";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-06-07-async-flow:一个用声明式的代码编写复杂异步逻辑的库/index.md": {
	id: "2020-06-07-async-flow:一个用声明式的代码编写复杂异步逻辑的库/index.md";
  slug: "write-asynchronous-logic-in-declarative-coding-style-with-async-flow";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-08-11-记一次树莓派磁盘占满的排查流程/index.md": {
	id: "2020-08-11-记一次树莓派磁盘占满的排查流程/index.md";
  slug: "troubleshooting-for-raspberry-pi's-out-of-disk-space";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022-07-17-Logseq同步方案设计/index.md": {
	id: "2022-07-17-Logseq同步方案设计/index.md";
  slug: "how-to-sync-logseq-notes-between-icloud-and-github";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023-02-08-2022总结/index.md": {
	id: "2023-02-08-2022总结/index.md";
  slug: "2022-summary";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023-05-03-如何为pve系统新增用户/index.md": {
	id: "2023-05-03-如何为pve系统新增用户/index.md";
  slug: "how-to-add-user-for-pve";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023-05-03-警惕！我差点被骗子盗走Telegram帐号的经历/index.md": {
	id: "2023-05-03-警惕！我差点被骗子盗走Telegram帐号的经历/index.md";
  slug: "how-i-nearly-lost-my-telegram-account";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023-05-17-使用 PM2 实时同步 Logseq 文件到 GitHub/index.md": {
	id: "2023-05-17-使用 PM2 实时同步 Logseq 文件到 GitHub/index.md";
  slug: "realtime-sync-logseq-to-github-using-pm2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023-09-01-drawtest/index.md": {
	id: "2023-09-01-drawtest/index.md";
  slug: "2023-09-01-drawtest";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023-09-23-使用k3s 和 tailscale 在甲骨文云和家之间搭建 kubernetes集群/index.md": {
	id: "2023-09-23-使用k3s 和 tailscale 在甲骨文云和家之间搭建 kubernetes集群/index.md";
  slug: "using-k3s-and-tailscale-to-build-kubernets-cluster-between-oraclecloud-and-home";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023-11-07-使用 cloudflare tunnel 访问 k3s 集群服务/index.md": {
	id: "2023-11-07-使用 cloudflare tunnel 访问 k3s 集群服务/index.md";
  slug: "using-cloudflare-tunnel-for-accessing-intranet-services-in-k3s-cluster";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"test.md": {
	id: "test.md";
  slug: "test";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
