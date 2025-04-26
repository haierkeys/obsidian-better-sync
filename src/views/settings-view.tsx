import BetterSync from "src/main";
import { useState } from "react";

import { $ } from "../lang/lang";


async function getClipboardContent(plugin: BetterSync): Promise<void> {
  const clipboardReadTipSave = async (api: string, apiToken: string, Vault: string, tip: string) => {
    if (plugin.settings.api != api || plugin.settings.apiToken != apiToken) {
      plugin.wsSettingChange = true
    }
    plugin.settings.api = api
    plugin.settings.apiToken = apiToken
    plugin.settings.vault = Vault
    plugin.clipboardReadTip = tip

    await plugin.saveSettings()
    plugin.settingTab.display()

    setTimeout(() => {
      plugin.clipboardReadTip = ""
    }, 2000)
  }

  //
  const clipboardReadTipTipSave = async (tip: string) => {
    plugin.clipboardReadTip = tip

    await plugin.saveData(plugin.settings)
    plugin.settingTab.display()

    setTimeout(() => {
      plugin.clipboardReadTip = ""
    }, 2000)
  }

  try {
    // 检查浏览器是否支持 Clipboard API
    if (!navigator.clipboard) {
      return
    }

    // 获取剪贴板文本内容
    const text = await navigator.clipboard.readText()

    // 检查是否为 JSON 格式
    let parsedData: any

    parsedData = JSON.parse(text)

    // 检查是否为对象且包含 api 和 apiToken
    if (typeof parsedData === "object" && parsedData !== null) {
      const hasApi = "api" in parsedData
      const hasApiToken = "apiToken" in parsedData
      const vault = "vault" in parsedData

      if (hasApi && hasApiToken && vault) {
        clipboardReadTipSave(parsedData.api, parsedData.apiToken, parsedData.vault, $("接口配置信息已经粘贴到设置中!"))
        return
      }
    }
    clipboardReadTipTipSave($("未检测到配置信息!"))
    return
  } catch (err) {
    clipboardReadTipTipSave($("未检测到配置信息!"))
    return
  }
}

export const SettingsView = ({ plugin }: { plugin: BetterSync }) => {
  return (
    <>
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">{$("远端服务搭建与选择")}</div>
          <div className="setting-item-description">{$("选择一个适合自己的远端")}</div>
        </div>
      </div>
      <div>
        <table className="better-sync-settings-openapi">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>{$("方式")}</th>
              <th style={{ textAlign: "center" }}>{$("说明")}</th>
              <th style={{ textAlign: "center" }}>{$("详情参考")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: "center" }}>{$("私有服务搭建")}</td>
              <td style={{ textAlign: "center" }}>{$("速度好, 自由配置, 无隐私风险")}</td>
              <td>
                <a href="https://github.com/haierkeys/obsidian-better-sync-service">https://github.com/haierkeys/obsidian-better-sync-service</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="clipboard-read">
        <button className="clipboard-read-button" onClick={() => getClipboardContent(plugin)}>
          {$("粘贴的远端配置")}
        </button>
        <div className="clipboard-read-description">{plugin.clipboardReadTip}</div>
      </div>
    </>
  )
}
