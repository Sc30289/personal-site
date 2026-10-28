import { useEffect } from 'react'
import { SITE_NAME, SITE_TITLE } from '../lib/site'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_TITLE
  }, [title])
}
