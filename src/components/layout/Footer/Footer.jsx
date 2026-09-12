import {
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  TELEGRAM_URL,
  WHATSAPP_URL,
} from '@/constants/contact'
import styles from './Footer.module.css'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.4.4 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.4.2-1.1.4-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.4-.4-1.1-.4-2.3-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .4-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .0-1.6.2-2 .3-.5.2-.8.3-1.1.6-.3.3-.5.6-.6 1.1-.1.4-.3 1-.3 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.0 1 .2 1.6.3 2 .2.5.3.8.6 1.1.3.3.6.5 1.1.6.4.1 1 .3 2 .3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.0 1.6-.2 2-.3.5-.2.8-.3 1.1-.6.3-.3.5-.6.6-1.1.1-.4.3-1 .3-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.0-1-.2-1.6-.3-2-.2-.5-.3-.8-.6-1.1-.3-.3-.6-.5-1.1-.6-.4-.1-1-.3-2-.3-1.2-.1-1.6-.1-4.7-.1zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.8a3.2 3.2 0 110 6.4 3.2 3.2 0 010-6.4zm5.3-3.3a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.96.54 3.8 1.49 5.4L2 22l4.93-1.58a9.9 9.9 0 004.99 1.35h.01c5.46 0 9.89-4.4 9.89-9.84C21.82 6.4 17.5 2 12.04 2zm5.75 14.03c-.24.67-1.38 1.23-1.91 1.31-.49.07-1.11.1-1.79-.11-.41-.13-.94-.3-1.62-.59-2.85-1.23-4.7-4.09-4.84-4.28-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35.19 0 .38 0 .54.01.17.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.28.14.44.12.6-.07.16-.19.7-.81.89-1.09.19-.28.38-.23.64-.14.26.09 1.67.79 1.96.93.28.14.47.21.54.33.07.12.07.7-.17 1.37z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M9.78 15.45l-.37 5.22c.53 0 .76-.23 1.04-.5l2.5-2.38 5.18 3.8c.95.52 1.63.25 1.88-.88l3.41-16.03h.01c.3-1.41-.51-1.96-1.44-1.62L1.72 9.7C.34 10.23.36 11.02 1.48 11.36l5.35 1.67L19.1 5.8c.62-.4 1.18-.18.72.23L9.78 15.45z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.wave}`}>
        <div className={styles.content}>
          <div className={styles.about}>
            <h3 className={styles.title}>درباره ما</h3>
            <p className={styles.text}>
              بهار یک فروشگاه آنلاین محصولات آرایشی و مراقبت پوست است که با
              بهترین کیفیت و قیمت مناسب در خدمت شماست.
            </p>
          </div>

          <div className={styles.contact}>
            <h3 className={styles.title}>تماس با ما</h3>
            <p className={styles.text}>
              مشهد بلوار پیروزی بین پیروزی ۳۲ و میدان حر
            </p>
            <p className={styles.text}>
              <a href={`tel:${CONTACT_PHONE}`} className={styles.phone}>
                {CONTACT_PHONE_DISPLAY}
              </a>
            </p>
          </div>

          <div className={styles.social}>
            <h3 className={styles.title}>ما را دنبال کنید</h3>
            <div className={styles.icons}>
              <a
                href={INSTAGRAM_URL}
                className={styles.socialLink}
                aria-label="اینستاگرام بهار"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </a>
              <a
                href={WHATSAPP_URL}
                className={styles.socialLink}
                aria-label="واتساپ بهار"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
              </a>
              <a
                href={TELEGRAM_URL}
                className={styles.socialLink}
                aria-label="تلگرام بهار"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TelegramIcon />
              </a>
            </div>
            <a
              href={INSTAGRAM_URL}
              className={styles.instagramHandle}
              target="_blank"
              rel="noopener noreferrer"
            >
              {INSTAGRAM_HANDLE}
            </a>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html:
                "<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=7481375&Code=g4cYiaVcRtoC2t0ObtE3cLCyRnR22tBc'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=7481375&Code=g4cYiaVcRtoC2t0ObtE3cLCyRnR22tBc' alt='' style='cursor:pointer' code='g4cYiaVcRtoC2t0ObtE3cLCyRnR22tBc'></a>",
            }}
          />
        </div>

        <p className={styles.copyright}>© ۱۴۰۴ بهار | تمامی حقوق محفوظ است.</p>
      </div>
    </footer>
  )
}
