import defaultSettings from '@/settings'

const title = defaultSettings.title || '市县经济社会发展现状分析数据管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
