import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import {
  ARTICLE_PROSE_CLASSES,
  detectArticleContentFormat,
} from '@/lib/article-content';

const markdownLink: Components['a'] = ({ href, children, ...props }) => (
  <a
    href={href}
    className="text-blue-500 underline font-bold hover:text-blue-400 transition-colors"
    target="_blank"
    rel="noopener noreferrer sponsored"
    {...props}
  >
    {children}
  </a>
);

const markdownComponents: Components = {
  a: markdownLink,
  h2: ({ children, ...props }) => (
    <h2
      className="text-white font-[var(--font-space)] text-2xl font-bold mt-10 mb-4"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="text-white font-[var(--font-space)] text-xl font-bold mt-8 mb-3"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-gray-300 leading-relaxed mb-6" {...props}>
      {children}
    </p>
  ),
};

type ArticleContentProps = {
  content: string;
};

export default function ArticleContent({ content }: ArticleContentProps) {
  const format = detectArticleContentFormat(content);

  if (format === 'html') {
    return (
      <div
        className={ARTICLE_PROSE_CLASSES}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className={ARTICLE_PROSE_CLASSES}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
