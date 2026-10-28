import { useEffect } from 'react'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Sc` : 'Sc · 个人网站'
  }, [title])
}
