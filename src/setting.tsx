import { App, PluginSettingTab, Notice, Setting, Platform } from "obsidian";
import { createRoot } from "react-dom/client";

import { SettingsView } from "./views/settings-view";
import { KofiImage } from "./lib/icons";
import BetterSync from "./main";
import { $ } from "./lang/lang";


export interface PluginSettings {
  //是否自动上传
  syncEnabled: boolean
  //API地址
  api: string
  wsApi: string
  //API Token
  apiToken: string
  vault: string
  lastSyncTime: number
  //  [propName: string]: any;
  clipboardReadTip: string
}

/**
 *

![这是图片](https://markdown.com.cn/assets/img/philly-magic-garden.9c0b4415.jpg)

 */

// 默认插件设置
export const DEFAULT_SETTINGS: PluginSettings = {
  // 是否自动上传
  syncEnabled: true,
  // API 网关地址
  api: "",
  wsApi: "",
  // API 令牌
  apiToken: "",
  lastSyncTime: 0,
  vault: "defaultVault",
  // 剪贴板读取提示
  clipboardReadTip: "",
}

export class SettingTab extends PluginSettingTab {
  plugin: BetterSync

  constructor(app: App, plugin: BetterSync) {
    super(app, plugin)
    this.plugin = plugin
    this.plugin.clipboardReadTip = ""
  }

  display(): void {
    const { containerEl: set } = this

    set.empty()

    // new Setting(set).setName("Better Sync").setDesc($("BetterSync")).setHeading()

    new Setting(set)
      .setName($("启用同步"))
      .setDesc($("关闭后您的笔记将不做任何同步"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.syncEnabled).onChange(async (value) => {
          if (value != this.plugin.settings.syncEnabled) {
            this.plugin.wsSettingChange = true
            this.plugin.settings.syncEnabled = value
            this.display()
            await this.plugin.saveSettings()
          }
        })
      )

    new Setting(set)
      .setName("| " + $("远端"))
      .setHeading()
      .setClass("better-sync-settings-tag")

    const root2 = document.createElement("div")
    root2.className = "better-sync-settings"
    set.appendChild(root2)

    const reactRoot2 = createRoot(root2)
    reactRoot2.render(<SettingsView plugin={this.plugin} />)

    const api = new Setting(set)
      .setName($("远端服务地址"))
      .setDesc($("选择一个 Obsidian-Better-Sync-Service 服务地址"))
      .addText((text) =>
        text
          .setPlaceholder($("输入您的 Image API Gateway 地址"))
          .setValue(this.plugin.settings.api)
          .onChange(async (value) => {
            if (value != this.plugin.settings.api) {
              this.plugin.wsSettingChange = true
              this.plugin.settings.api = value
              await this.plugin.saveSettings()
            }
          })
      )

    const apiToken = new Setting(set)
      .setName($("远端服务令牌"))
      .setDesc($("用于远端服务的访问授权令牌"))
      .addText((text) =>
        text
          .setPlaceholder($("输入您的 API 访问令牌"))
          .setValue(this.plugin.settings.apiToken)
          .onChange(async (value) => {
            if (value != this.plugin.settings.apiToken) {
              this.plugin.wsSettingChange = true
              this.plugin.settings.apiToken = value
              await this.plugin.saveSettings()
            }
          })
      )

    new Setting(set)
      .setName($("远端仓库名"))
      .setDesc($("远端仓库名"))
      .addText((text) =>
        text
          .setPlaceholder($("远端仓库名"))
          .setValue(this.plugin.settings.vault)
          .onChange(async (value) => {
            this.plugin.settings.vault = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(set)
      .setName("| " + $("支持"))
      .setHeading()
      .setClass("better-sync-settings-tag")
    let y = new Setting(set)
      .setName($("捐赠"))
      .setDesc($("如果您喜欢这个插件，请考虑捐赠以支持继续开发。"))
      .settingEl.createEl("a", { href: "https://ko-fi.com/haierkeys" })
      .createEl("img", {
        attr: { src: KofiImage, height: "36", border: "0", alt: "Buy Me a Coffee at ko-fi.com", style: "height:36px!important;border:0px!important;" },
      })

    const debugDiv = set.createDiv()
    debugDiv.setAttr("align", "center")
    debugDiv.setAttr("style", "margin: var(--size-4-2)")

    const debugButton = debugDiv.createEl("button")
    debugButton.setText($("复制 Debug 信息"))
    debugButton.onclick = async () => {
      await window.navigator.clipboard.writeText(
        JSON.stringify(
          {
            settings: this.plugin.settings,
            pluginVersion: this.plugin.manifest.version,
          },
          null,
          4
        )
      )
      new Notice($("将调试信息复制到剪贴板, 可能包含敏感信!"))
    }

    if (Platform.isDesktopApp) {
      const info = set.createDiv()
      info.setAttr("align", "center")
      info.setText($("通过快捷键打开控制台，你可以看到这个插件和其他插件的日志"))

      const keys = set.createDiv()
      keys.setAttr("align", "center")
      keys.addClass("custom-shortcuts")
      if (Platform.isMacOS === true) {
        keys.createEl("kbd", { text: "CMD (⌘) + OPTION (⌥) + I" })
      } else {
        keys.createEl("kbd", { text: "CTRL + SHIFT + I" })
      }
    }
  }
}
