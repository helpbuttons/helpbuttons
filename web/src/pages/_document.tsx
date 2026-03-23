import Document, { 
  DocumentContext, 
  Head, 
  Html, 
  Main, 
  NextScript,
  DocumentInitialProps
} from 'next/document';
import getEnvConfig from 'next/config';

class MyDocument extends Document {

  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & { locale: string }> {
    const initialProps = await Document.getInitialProps(ctx);

    const cookieLocale = ctx.req?.headers?.cookie?.match(/locale=([^;]+)/)?.[1];
    
    const { publicRuntimeConfig } = getEnvConfig();
    const defaultLocale = publicRuntimeConfig?.defaultLocale || 'en';
    
    const lang = cookieLocale || defaultLocale;

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
