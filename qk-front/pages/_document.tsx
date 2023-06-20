import NextDocument, { Head, Html, Main, NextScript } from "next/document"

export default class Document extends NextDocument {
   render(): JSX.Element {
      return (
         <Html>
            <Head>
               <meta content="Qualkey creates a secure, permanent and auditable record of certifications. Learners can instantly share their secure and verified credentials with a click of a button. Employers use Qualkey to verify a candidate's certification record reliably and quickly. Saving time and cost while building trust."
                      name="description"/>
               <link href="https://fonts.googleapis.com" rel="preconnect" />
               <link href="https://fonts.gstatic.com" rel="preconnect" />
               <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
                      rel="stylesheet"/>
            </Head>
            <body>
               <Main/>
               <NextScript/>
            </body>
         </Html>
      )
   }
}