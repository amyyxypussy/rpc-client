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
// @namespace    http://tampermonkey.net/
// @version      ${version}
// @description  site.zxhy
// @author       ashen
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js
// @require      file://D:\\workspace\\crawler\\rpc-server\\tampermonkey_shell\\xx.js
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