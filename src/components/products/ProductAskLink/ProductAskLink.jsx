import { INSTAGRAM_URL } from '@/constants/contact'
import styles from './ProductAskLink.module.css'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.4.4 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.4.2-1.1.4-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.4-.4-1.1-.4-2.3-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .4-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .0-1.6.2-2 .3-.5.2-.8.3-1.1.6-.3.3-.5.6-.6 1.1-.1.4-.3 1-.3 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.0 1 .2 1.6.3 2 .2.5.3.8.6 1.1.3.3.6.5 1.1.6.4.1 1 .3 2 .3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.0 1.6-.2 2-.3.5-.2.8-.3 1.1-.6.3-.3.5-.6.6-1.1.1-.4.3-1 .3-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.0-1-.2-1.6-.3-2-.2-.5-.3-.8-.6-1.1-.3-.3-.6-.5-1.1-.6-.4-.1-1-.3-2-.3-1.2-.1-1.6-.1-4.7-.1zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.8a3.2 3.2 0 110 6.4 3.2 3.2 0 010-6.4zm5.3-3.3a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
    </svg>
  )
}

/**
 * @param {{
 *   productName?: string
 *   className?: string
 *   iconOnly?: boolean
 * }} props
 */
export function ProductAskLink({ productName, className = '', iconOnly = false }) {
  return (
    <a
      href={INSTAGRAM_URL}
      className={`${iconOnly ? styles.iconLink : styles.link} ${className}`.trim()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      aria-label={productName ? `سوال درباره ${productName} در اینستاگرام` : 'پرسش در اینستاگرام'}
      title={productName ? `سوال درباره ${productName}` : 'هنوز مطمئن نیستی؟ ازم بپرس.'}
    >
      {iconOnly ? <InstagramIcon /> : 'هنوز مطمئن نیستی؟ ازم بپرس.'}
    </a>
  )
}
