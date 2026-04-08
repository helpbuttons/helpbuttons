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
          <link rel="icon" href="/favicon.ico" />
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
