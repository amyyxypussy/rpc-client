// build.config.ts
import { defineBuildConfig } from 'unbuild'
import { version } from './package.json'

export default defineBuildConfig([
  {
    entries: [
      'src/main'
    ],
    clean: true,
    declaration: true,
    rollup: {
      emitCJS: false, // 关闭 CommonJS 输出
      esbuild: { 
        target: "es2015" // 设置目标语法版本
      },
      dts: {
        respectExternal: false,
      },
      output: {
        format: "iife", // 指定为 IIFE 格式
        name: "MyLibrary", // 全局变量名（浏览器端通过此名称访问）
      }
    },
    failOnWarn: false,
  },
  {
    entries: [
      'src/shell'
    ],
    clean: true,
    declaration: true,
    rollup: {
      emitCJS: false, // 关闭 CommonJS 输出
      esbuild: { 
        target: "es2015" // 设置目标语法版本
      },
      dts: {
        respectExternal: false,
      },
      output: {
        format: "iife", // 指定为 IIFE 格式
        name: "RPC", // 全局变量名（浏览器端通过此名称访问）
        banner: `
// ==UserScript==
// @name         jsrpc 配合 scrapy 爬取数据
// @namespace    http://tampermonkey.net/
// @updateURL    https://cdn.jsdelivr.net/gh/amyyxypussy/rpc-client/dist/shell.mjs
// @version      ${version}
// @description  site.zxhy
// @author       ashen
// @require      https://cdn.jsdelivr.net/gh/amyyxypussy/rpc-client/dist/main.mjs
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mouser.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==
        `
      },
    },
    failOnWarn: false,
  }
])