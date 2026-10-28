import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'

/** 统一的 Markdown 渲染：GFM 表格/任务列表 + 标题锚点 + 代码高亮。 */
export default function Markdown({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-site max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeHighlight, { ignoreMissing: true, detect: false }]]}
        components={{
          a: ({ href, children }) => {
            const external = Boolean(href && /^https?:\/\//.test(href))
            return (
              <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
                {children}
              </a>
            )
          },
          img: ({ src, alt }) => <img src={src} alt={alt ?? ''} loading="lazy" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
