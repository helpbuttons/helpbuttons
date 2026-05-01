import Document, { 
  DocumentContext, 
  Head, 
  Html, 
  Main, 
  NextScript,
  DocumentInitialProps
} from 'next/document';
import { getLocaleFromCookie } from 'shared/sys.helper';

class MyDocument extends Document {

  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & { locale: string }> {
    const initialProps = await Document.getInitialProps(ctx);

    const lang = ctx.req?.headers?.cookie?.match(/locale=([^;]+)/)?.[1];

    return {
      ...initialProps,
      locale: lang,
    };
  }

  render() {
    return (
      <Html lang={this.props.locale}>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon/favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/favicon/android-chrome-512x512.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
