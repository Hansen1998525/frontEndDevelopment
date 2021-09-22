import defaultSettings from '@/settings'

const title = defaultSettings.title || '鲸歌'

export default function getPageTitle(pageTitle) {
    if (pageTitle) {
        return `${pageTitle} - ${title}`
    }
    return `${title}`
}