import { FaqCategoriesEnum } from "@customTypes/constants"

import type { FaqQuestionType } from "@customTypes/constants"

export const allCategories = [
   FaqCategoriesEnum.ALL,
   FaqCategoriesEnum.STUDENTS,
   FaqCategoriesEnum.EDUCATORS,
   FaqCategoriesEnum.EMPLOYERS,
]

export const faqQuestions: FaqQuestionType[] = [
   {
      question: "What is Qualkey?",
      answer: "QualKey partners with issuers of qualifications to provide secure digital credentials so a person can prove instantly the authenticity of their qualification to third parties.",
      categories: allCategories,
      isShown: false
   },
   {
      question: "How are qualifications added to an account?",
      answer: "QualKey partners with the education" +
         " institutions that issue qualifications. Upon completion of a qualification, the issuer uses QualKey to" +
         " create pre-authenticated digital credentials. The digital credentials are then immediately visible, and" +
         " need to be 'activated' before they can be shared.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.STUDENTS, FaqCategoriesEnum.EMPLOYERS],
      isShown: false
   },
   {
      question: "Why do I need to activate my digital credentials?",
      answer: "On completion of your qualification," +
         " your educational institution provides QualKey with the digital credentials underpinning your" +
         " qualification. QualKey stores your credentials for free but you will need to activate your credentials in" +
         " order to share them with third parties.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.STUDENTS],
      isShown: false
   },
   {
      question: "Do I need to pay a subscription?",
      answer: "QualKey does not operate a subscription based service. For individuals, QualKey charges a one-off payment for each qualification that provides access and unlimited sharing for a given period. For employers and educators there are no registration or subscription requirements.",
      categories: allCategories,
      isShown: false
   },
   {
      question: "Why should I trust the authenticity of qualifications in QualKey?",
      answer: "QualKey builds" +
         " relationships with educational institutions. Each institution that partners with us has an unique code" +
         " and will display on their website that QualKey is an official partner to provide their authenticated" +
         " qualification. In addition, each qualification can be independently verified on the public ledger of" +
         " Hedera.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.STUDENTS, FaqCategoriesEnum.EMPLOYERS],
      isShown: false
   },
   {
      question: "What are digital credentials?",
      answer: "Digital credentials are the inform," +
         "isShown: falsification that underpin a qualification, such as the start, end, and" +
         " graduation date for a qualification, along with the name of the issuing educational institution. Additional credentials may be available depending on the educational institution.",
      categories: allCategories,
      isShown: false
   },
   {
      question: "How does QualKey authenticate my qualifications?",
      answer: "QualKey partners directly with" +
         " educational institutions. On completion of a qualification, the institution provides Qualkey with digital" +
         " credentials confirming that the person is entitled to receive the qualification.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.STUDENTS, FaqCategoriesEnum.EMPLOYERS],
      isShown: false
   },
   {
      question: "Why have I been asked by my educational institution to register for a QualKey account?",
      answer: "QualKey has partnered with your educational institution to provide secure digital credentials that prove your qualification is authentic. Your credentials can be shared instantly with employers or other educational institutions who may ask you to show your qualification is genuine.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.STUDENTS],
      isShown: false
   },
   {
      question: "Can qualifications be edited once issued?",
      answer: "Yes. Issuing educational institutions retain" +
         " the right to change information of the qualifications they issued. Each change is logged as an additional" +
         " entry on Hedera. This ensures a complete audit trail that can be independently verified.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.STUDENTS, FaqCategoriesEnum.EMPLOYERS],
      isShown: false
   },
   {
      question: "Who can digital credentials be shared with?",
      answer: "Digital credentials can be shared by email with anyone the owner chooses. This saves time and effort in verifying your qualifications.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.STUDENTS, FaqCategoriesEnum.EMPLOYERS],
      isShown: false
   },
   {
      question: "How do I share my digital credentials?",
      answer: "From the home screen you can share digital credentials for multiple qualifications in one email by selecting the relevant qualifications. Alternatively, you can share digital credentials for a single qualification within the credentials page of the relevant qualification. In order to share, the recipient's email address and name are required.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.STUDENTS],
      isShown: false
   },
   {
      question: "Will third parties be able to view permanently all my digital credentials?",
      answer: "Third parties will only be able to view the digital credentials you choose to share, until the expiry period of your choice. Through QualKey, every person has full control of who views their digital credentials and for how long.",
      categories: allCategories,
      isShown: false
   },
   {
      question: "Why are some of the credentials blank or missing information?",
      answer: "QualKey provides autonomy of data to qualification owners. If a qualification owner has decided not to share specific credentials underpinning their qualification (e.g. GPA) this will not be visible to a third party. Equally, if an issuing educational institution has not provided a complete set of credentials, those omitted will not be visible to the owner.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.STUDENTS, FaqCategoriesEnum.EMPLOYERS],
      isShown: false
   },
   {
      question: "Can digital credentials be withdrawn?",
      answer: "Yes. The issuing educational institution can withdraw a qualification. Once withdrawn, digital credentials for a qualification will still remain visible to the owner, but can no longer be shared. Withdrawals are often a result of disciplinary action by the educational institution and need to be resolved directly with them. QualKey cannot offer a refund if a qualification was activated before it was withdrawn.",
      categories: allCategories,
      isShown: false
   },
   {
      question: "Can digital credentials expire?",
      answer: "Yes. Some qualifications carry an expiry date, requiring a renewal instruction from the issuing educational institution. Once expired, digital credentials for a qualification will still remain visible to the owner, but can no longer be shared.",
      categories: allCategories,
      isShown: false
   },
   {
      question: "Can I view the original qualification certificate?",
      answer: "QualKey does not store a person's original certificate. Instead, QualKey stores the digital credentials that underpin their qualification and confirms it's authentic. These credentials form a permanent record that can be shared with those whom have been granted viewing permission.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.STUDENTS, FaqCategoriesEnum.EMPLOYERS],
      isShown: false
   },
   {
      question: "How do I independently verify a qualification?",
      answer: "Each qualification is given an Hedera hashgraph ID. This can be searched for using an independent Hedera explorer, such as Dragonglass (app.dragonglass.me/hedera/home). After finding the entry, follow the displayed link to confirm it goes back to the qualification on QualKey and check if the authentication dates match.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.EMPLOYERS],
      isShown: false
   },
   {
      question: "Who has access to qualification data?",
      answer: "QualKey aspires to provide maximum privacy of people's data. QualKey administrators have initial access to view qualification credentials. However, the credentials are then encrypted to provide data autonomy, so that the only people who can view credentials are;\n" +
         "1) the individual, who earned the qualification;\n" +
         "2) the educational institution who issued the qualification;\n" +
         "3) any third party the individual has chosen to share the qualification.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.STUDENTS, FaqCategoriesEnum.EDUCATORS],
      isShown: false
   },
   {
      question: "Does QualKey use blockchain?",
      answer: "No. QualKey has partnered with Hedera to use their patented hashgraph technology, which often is referred to as the next generation of blockchain. Compared to blockchain, hashgraph requires up to 5 million times less energy for transactions. Like blockchain, hashgraph uses decentralised ledger technology to create a secure, permanent and immutable record of a qualification. For each qualification, QualKey provides an Hedera hashgraph ID which can be verified independently if required.",
      categories: allCategories,
      isShown: false
   },
   {
      question: "What is decentralised ledger technology (DLT)?",
      answer: "Decentralised ledger technology (DLT) is a broad term that describes a system where data is recorded in multiple locations, often where one entity does not have not full control over the system. DLT includes technologies like blockchain or Hedera's hashgraph but are not limited to these technologies.",
      categories: allCategories,
      isShown: false
   },
   {
      question: "What is Hedera hashgraph?",
      answer: "Hedera hashgraph is a patented technology that leverages the learnings from blockchain to create an immutable ledger while addressing the downsides like volatility in prices and huge energy consumption. It is operated by the Hedera Council whose members agree on further development of the technology. Learn more here: https://hedera.com/",
      categories: allCategories,
      isShown: false
   },
   {
      question: "What is the Hash ID?",
      answer: "All authenticated qualifications added to QualKey are given a unique Hash ID. The hash is a cryptographic algorithm that creates a unique encryption code for a person's credentials. QualKey issues a Hash ID so that individual's privacy rights are maintained and personal data is not stored on Hedera hashgraph.",
      categories: allCategories,
      isShown: false
   },
   {
      question: "What is the Hedera hashgraph ID?",
      answer: "All authenticated qualifications added to QualKey are given a unique Hedera hashgraph ID. This allows an individual or a third party to independently verify that credentials have been registered on the Hedera hashgraph. QualKey uses hashgraph to provide an additional layer of trust to show that credentials are authentic.",
      categories: allCategories,
      isShown: false
   },
   {
      question: "What is the Certificate ID?",
      answer: "All authenticated qualifications added to QualKey are given a unique Certificate ID. This is used for internal purposes only by QualKey.",
      categories: allCategories,
      isShown: false
   },
   {
      question: "How do I contact QualKey?",
      answer: "We welcome your feedback and insights. If you have any questions or comments, please contact us at info@qualkey.org or leave a message via our website www.qualkey.org",
      categories: allCategories,
      isShown: false
   },
   {
      question: "How can I delete my qualification?",
      answer: "All users can exercise their 'right to be forgotten' provided by EU-GDPR regulations. As a first step, you need to view the credentials for the qualification that you want to delete. Then scroll down to 'Delete Credentials'.\n" +
         "BE ADVISED: Deleting a qualification cannot be undone. QualKey cannot restore the qualification and the entry on the public ledger will be disconnected. If the qualification was activated, QualKey cannot refund the costs.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.STUDENTS],
      isShown: false
   },
   {
      question: "How can I delete my account?",
      answer: "All users can exercise their 'right to be forgotten' provided by EU-GDPR regulations. This includes the complete deletion of the account. The account can be deleted in the account settings.\n" +
         "BE ADVISED: Deleting an account will be executed immediately with a cool-off period of 30 days. After the" +
         " cool-off period the account cannot be reactivated. All earned qualifications and the account will be permanently deleted. QualKey cannot restore your account and the entry on the public ledger will be disconnected. If one or more qualifications were activated by the time of the account deletion, QualKey cannot refund the costs.",
      categories: [FaqCategoriesEnum.ALL, FaqCategoriesEnum.STUDENTS],
      isShown: false
   },
]