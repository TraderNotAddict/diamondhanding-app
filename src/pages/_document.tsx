import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="Diamondhanding" />
          <link rel="stylesheet" href="https://use.typekit.net/hln2pkb.css" />
        </Head>
        <body>
          <div id="global-modal"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
