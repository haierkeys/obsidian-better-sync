import { $ } from "../lang/lang";
import { NoteSync } from "./fs";
import FastSync from "../main";


export const AddRibbonIcon = async function (plugin: FastSync) {
  clearInterval(plugin.ribbonIconInterval)
  plugin.ribbonIconInterval = setInterval(() => {
    if (plugin.websocket.isOpen != true) {
      if (plugin.ribbonIconStatus && plugin.ribbonIcon) {
        plugin.ribbonIcon.remove()
        plugin.ribbonIconStatus = false
      }
      plugin.ribbonIcon = plugin.addRibbonIcon("loader-circle",  "Fast Sync: " + $("同步全部笔记"), () => {
        NoteSync(plugin)
      })
    } else {
      if (!plugin.ribbonIconStatus && plugin.ribbonIcon) {
        plugin.ribbonIcon.remove()
        plugin.ribbonIconStatus = true
      }
      plugin.ribbonIcon = plugin.addRibbonIcon("rotate-cw",  "Fast Sync: " + $("同步全部笔记"), () => {
        NoteSync(plugin)
      })
    }
  }, 1000)
}

// export const addCustomStyles = function () {
//   const style = `
//             .fast-sync-ribbon-icon {
//                 animation: rotate 2s linear infinite; /* 旋转动画：2秒一圈，线性，无限循环 */
//             }
//             @keyframes rotate {
//                 from {
//                     transform: rotate(0deg);
//                 }
//                 to {
//                     transform: rotate(360deg);
//                 }
//             }
//         `
//   const stylesheet = document.createElement("style")
//   stylesheet.textContent = style
//   document.head.appendChild(stylesheet)
// }
