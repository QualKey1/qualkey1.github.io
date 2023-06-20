import React from "react"

import axios from "axios"
import { getCookie } from "cookies-next"
import dynamic from "next/dynamic"
import Head from "next/head"
import Image from "next/image"

import logoText from "@assets/images/logo-blue-text.svg"
import { apiUrl } from "@constants/urls"
import { Heading, Text, Loading } from "@lib/components"

import type { MainLayoutType } from "@customTypes/layouts"
import type { PublicPageType } from "@customTypes/pages"
import type { GetServerSideProps, NextPage } from "next"

const MainLayout = dynamic<MainLayoutType>(() => import("@layouts/MainLayout/MainLayout").then(module => module.MainLayout),
   { loading: () => <Loading isOpen={true}/> })

const Policy: NextPage<PublicPageType> = ({ userData, actionData, shareId }): JSX.Element => {

   return (
      <>
         <Head>
            <title>Privacy Policy | QualKey</title>
         </Head>

         <MainLayout actionData={actionData} shareId={shareId} userData={userData}>
            <Heading color="blue" component="h1" size="lg">
               Privacy Policy
            </Heading>

            <div className="policy">

               <div className="policy__top">
                  <Image alt="Qualkey | Qualifications protected" height={94} objectFit="contain"
                         src={logoText}
                         width={182}/>
               </div>

               <div className="policy__content">
                  <Text thin color="800" component="p"
                        size="paragraph">
                     This privacy policy applies between you, the User of this Website, and QualKey Ltd., the owner
                     and
                     provider of this Website. QualKey Ltd. takes the privacy of your information very seriously.
                     This
                     privacy
                     policy applies to our use of any and all Data collected by us or provided by you in relation to
                     your use of
                     the Website.
                  </Text>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     This privacy policy should be read alongside, and in addition to, our Terms and Conditions, which
                     can be found at: https://qualkey.co.uk/tos
                  </Text>
                  <Text bold color="800" component="p"
                        size="paragraph">
                     Please read this privacy policy carefully.
                  </Text>
               </div>

               <div className="policy__block">
                  <Heading color="800" component="h3" size="sm">
                     Definition and interpretation
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     1. In this privacy policy, the following definitions are used:
                  </Text>
                  <div className="policy__definition">

                     <div className="policy__definition--item">
                        <Text bold color="800" component="p"
                              size="paragraph">
                           Data
                        </Text>
                        <Text thin color="800" component="p"
                              size="paragraph">
                           collectively all information that you submit to Qualkey Limited via the Website. This
                           definition incorporates, where applicable, the definitions provided in the Data Protection
                           Laws;
                        </Text>
                     </div>

                     <div className="policy__definition--item">
                        <Text bold color="800" component="p"
                              size="paragraph">
                           Cookies
                        </Text>
                        <Text thin color="800" component="p"
                              size="paragraph">
                           a small text file placed on your computer by this Website when you visit certain parts of the
                           Website and /or when you use certain features of the Website. Details of the cookies used by
                           this Website are set out in the clause below (Cookies);
                        </Text>
                     </div>

                     <div className="policy__definition--item">
                        <Text bold color="800" component="p"
                              size="paragraph">
                           Data
                           Protection
                           Laws
                        </Text>
                        <Text thin color="800" component="p"
                              size="paragraph">
                           any applicable law relating to the processing of personal Data, including but not limited to
                           the GDPR, Protection and any national implementing and supplementary laws, regulations and
                           secondary legislation;
                        </Text>
                     </div>

                     <div className="policy__definition--item">
                        <Text bold color="800" component="p"
                              size="paragraph">
                           GDPR
                        </Text>
                        <Text thin color="800" component="p"
                              size="paragraph">
                           the UK General Data Protection Regulation;
                        </Text>
                     </div>

                     <div className="policy__definition--item">
                        <Text bold color="800" component="p"
                              size="paragraph">
                           QualKey Limited, we or us
                        </Text>
                        <Text thin color="800" component="p"
                              size="paragraph">
                           Qualkey Limited, a company incorporated in England and Wales with registered number 13585541
                           whose registered office is at 167-169 Great Portland Street, 5th Floor, London, Greater
                           London, W1W 5PF;
                        </Text>
                     </div>

                     <div className="policy__definition--item">
                        <Text bold color="800" component="p"
                              size="paragraph">
                           UK and EU
                           Cookie Law
                        </Text>
                        <Text thin color="800" component="p"
                              size="paragraph">
                           the Privacy and Electronic Communications (EC Directive) Regulations 2003 as
                           amended by the Privacy and Electronic Communications (EC Directive)
                           (Amendment) Regulations 2011 &amp; the Privacy and Electronic Communications
                           (EC Directive) (Amendment) Regulations 2018;
                        </Text>
                     </div>

                     <div className="policy__definition--item">
                        <Text bold color="800" component="p"
                              size="paragraph">
                           User or you
                        </Text>
                        <Text thin color="800" component="p"
                              size="paragraph">
                           any third party that accesses the Website and is not either (i) employed by Qualkey Limited
                           and acting in the course of their employment or (ii) engaged as a consultant or otherwise
                           providing services to Qualkey Limited and accessing the Website in connection with the
                           provision of such services; and
                        </Text>
                     </div>

                     <div className="policy__definition--item">
                        <Text bold color="800" component="p"
                              size="paragraph">
                           Website
                        </Text>
                        <Text thin color="800" component="p"
                              size="paragraph">
                           the website that you are currently using, https://qualkey.co.uk/, and any sub-domains of this
                           site unless expressly excluded by their own terms and conditions
                        </Text>
                     </div>

                  </div>

                  <Text thin color="800" component="p"
                        size="paragraph">
                     2. In this privacy policy, unless the context requires a different interpretation:
                  </Text>
                  <div className="policy__list">
                     <Text thin color="800" component="p"
                           size="paragraph">
                        a. the singular includes the plural and vice versa;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        b. references to sub-clauses, clauses, schedules or appendices are to sub-clauses, clauses,
                        schedules or appendices of this privacy policy;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        c. reference to a person includes firms, companies, government entities, trusts and
                        partnerships;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        d. &quot;including&quot; is understood to mean &quot;including without limitation&quot;;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        e. reference to any statutory provision includes any modification or amendment of it;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        f. the headings and sub-headings do not form part of this privacy policy.
                     </Text>
                  </div>

               </div>

               <div className="policy__block">
                  <Heading color="800" component="h3" size="sm">
                     Scope of this privacy policy
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     3. This privacy policy applies only to the actions of QualKey Ltd. and Users with respect to this
                     Website. It does not extend to any websites that can be accessed from this Website including, but
                     not limited to, any links we may provide to social media websites.
                  </Text>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     4. For purposes of the applicable Data Protection Laws, QualKey Ltd. is the “data controller”. This
                     means that QualKey Ltd. determines the purposes for which, and the manner in which, your Data is
                     processed.
                  </Text>
               </div>

               <div className="policy__block">
                  <Heading color="800" component="h3" size="sm">
                     Data collected
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     5. We may collect the following Data, which includes personal Data, from you:
                  </Text>
                  <div className="policy__list">
                     <Text thin color="800" component="p"
                           size="paragraph">
                        a. name;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        b. date of birth;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        c. contact Information such as email addresses and telephone numbers;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        d. demographic information such as postcode, preferences and interests;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        e. IP address (automatically collected);
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        f. web browser type and version (automatically collected);
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        g. operating system (automatically collected);
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        h. a list of URLs starting with a referring site, your activity on this Website, and the site
                        you exit to
                        (automatically collected);
                     </Text>
                  </div>
               </div>

               <div className="policy__block">
                  <Heading color="800" component="h3" size="sm">
                     How we collect Data
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     6. We collect Data in the following ways:
                  </Text>
                  <div className="policy__list">
                     <Text thin color="800" component="p"
                           size="paragraph">
                        a. data is given to us by you; and
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        b. data is collected automatically.
                     </Text>
                  </div>
               </div>

               <div className="policy__block">
                  <Heading color="800" component="h3" size="sm">
                     Data that is given to us by you
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     7. QualKey Ltd. will collect your Data in a number of ways, for example:
                  </Text>
                  <div className="policy__list">
                     <Text thin color="800" component="p"
                           size="paragraph">
                        a. when you contact us through the Website, by telephone, post, e-mail or through any other
                        means;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        b. when you register with us and set up an account to receive our products/services;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        c. when you make payments to us, through this Website or otherwise;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        d. when you elect to receive marketing communications from us;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        e. when you use our services;data is given to us by you; and
                        in each case, in accordance with this privacy policy.
                     </Text>
                  </div>
               </div>

               <div className="policy__block">
                  <Heading color="800" component="h3" size="sm">
                     Data that is collected automatically
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     8. To the extent that you access the Website, we will collect your Data automatically, for example:
                  </Text>
                  <div className="policy__list">
                     <Text thin color="800" component="p"
                           size="paragraph">
                        a. we automatically collect some information about your visit to the Website. This information
                        helps us to make improvements to Website content and navigation, and includes your IP
                        address, the date, times and frequency with which you access the Website and the way you use
                        and interact with its content.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        b. we will collect your Data automatically via cookies, in line with the cookie settings on your
                        browser. For more information about cookies, and how we use them on the Website, see the
                        section below, headed “Cookies”
                     </Text>
                  </div>
               </div>

               <div className="policy__block">
                  <Heading color="800" component="h3" size="sm">
                     Our use of Data
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     9. Any or all of the above Data may be required by us from time to time in order to provide you
                     with
                     the best possible service and experience when using our Website. Specifically, Data may be used by
                     us for the following reasons:
                  </Text>
                  <div className="policy__list">
                     <Text thin color="800" component="p"
                           size="paragraph">
                        a. internal record keeping;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        b. improvement of our products / services;
                     </Text>
                  </div>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     10. We may use your Data for the above purposes if we deem it necessary to do so for our legitimate
                     interests. If you are not satisfied with this, you have the right to object in certain
                     circumstances (see
                     the section headed &quot;Your rights&quot; below).
                  </Text>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     11) When you register with us and set up an account to receive our services, the legal basis for
                     this processing is the performance of a contract between you and us and/or taking steps, at your
                     request, to enter into such a contract.
                  </Text>
               </div>

               <div className="policy__block">
                  <Heading color="800" component="h3" size="sm">
                     Who we share Data with
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     12. We may share your Data with the following groups of people for the following reasons:
                  </Text>
                  <div className="policy__list">
                     <Text thin color="800" component="p"
                           size="paragraph">
                        a. our employees, agents and/or professional advisors - to process orders and provide customer
                        support;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        b. third party service providers who provide services to us which require the processing of
                        personal data - to create a digital identity of the earned certificate or qualification in an
                        anonymized form on a public ledger called Hedera, and ensuring human interactions on QualKey’s
                        website;
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        c. third party payment providers who process payments made over the Website - to process
                        payments through Stripe or PayPal;
                        in each case, in accordance with this privacy policy.
                     </Text>
                  </div>
               </div>

               <div className="policy__block">
                  <Heading color="800" component="h3" size="sm">
                     Keeping Data secure
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     13. We will use technical and organisational measures to safeguard your Data, for example:
                  </Text>
                  <div className="policy__list">
                     <Text thin color="800" component="p"
                           size="paragraph">
                        a. access to your account is controlled by a password and a user name that is unique to you.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        b. we store your Data on secure servers.
                     </Text>
                  </div>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     14. Technical and organisational measures include measures to deal with any suspected data breach.
                     If you suspect any misuse or loss or unauthorised access to your Data, please let us know
                     immediately by contacting us via this e-mail address: info@changingattire.co.uk.
                  </Text>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     15. If you want detailed information from Get Safe Online on how to protect your information and
                     your computers and devices against fraud, identity theft, viruses and many other online problems,
                     please visit www.getsafeonline.org. Get Safe Online is supported by HM Government and leading
                     businesses.
                  </Text>
               </div>

               <div className="policy__block">
                  <Heading color="800" component="h3" size="sm">
                     Data retention
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     16. Unless a longer retention period is required or permitted by law, we will only hold your Data
                     on
                     our systems for the period necessary to fulfil the purposes outlined in this privacy policy or
                     until you
                     request that the Data be deleted.
                  </Text>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     17. Even if we delete your Data, it may persist on backup or archival media for legal, tax or
                     regulatory purposes.
                  </Text>
               </div>

               <div className="policy__block">
                  <Heading color="800" component="h3" size="sm">
                     Your rights
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     18. You have the following rights in relation to your Data:
                  </Text>
                  <div className="policy__list">
                     <Text thin color="800" component="p"
                           size="paragraph">
                        a. Right to access - the right to request (i) copies of the information we hold about you at any
                        time, or (ii) that we modify, update or delete such information. If we provide you with access
                        to
                        the information we hold about you, we will not charge you for this, unless your request is
                        &quot;manifestly unfounded or excessive.&quot; Where we are legally permitted to do so, we may
                        refuse
                        your request. If we refuse your request, we will tell you the reasons why.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        b. Right to correct - the right to have your Data rectified if it is inaccurate or incomplete.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        c. Right to erase - the right to request that we delete or remove your Data from our systems.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        d. Right to restrict our use of your Data - the right to &quot;block&quot; us from using your
                        Data or limit the
                        way in which we can use it.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        e. Right to data portability - the right to request that we move, copy or transfer your Data.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        f. Right to object - the right to object to our use of your Data including where we use it for
                        our
                        legitimate interests.
                     </Text>
                  </div>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     19. To make enquiries, exercise any of your rights set out above, or withdraw your consent to the
                     processing of your Data (where consent is our legal basis for processing your Data), please contact
                     us via this e-mail address: hans.winkler@changingattire.co.uk.
                  </Text>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     20. If you are not satisfied with the way a complaint you make in relation to your Data is handled
                     by
                     us, you may be able to refer your complaint to the relevant data protection authority. For the UK,
                     this is the Information Commissioner&#39;s Office (ICO). The ICO&#39;s contact details can be found
                     on their
                     website at https://ico.org.uk/.
                  </Text>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     21. It is important that the Data we hold about you is accurate and current. Please keep us
                     informed
                     if your Data changes during the period for which we hold it.
                  </Text>
               </div>

               <div className="policy__block">
                  <Heading color="800" component="h3" size="sm">
                     Transfers outside the United Kingdom and European Economic Area
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     22. Data which we collect from you may be stored and processed in and transferred to countries
                     outside of the UK and European Economic Area (EEA). For example, this could occur if our servers
                     are located in a country outside the UK or EEA or one of our service providers is situated in a
                     country outside the UK or EEA. We also share information with our group companies, some of which
                     are located outside the UK or EEA.
                  </Text>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     23. We will only transfer Data outside the UK or EEA where it is compliant with data protection
                     legislation and the means of transfer provides adequate safeguards in relation to your data, eg by
                     way of data transfer agreement, incorporating the current standard contractual clauses adopted by
                     the European Commission.
                  </Text>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     24. To ensure that your Data receives an adequate level of protection, we have put in place
                     appropriate safeguards and procedures with the third parties we share your Data with. This ensures
                     your Data is treated by those third parties in a way that is consistent with the Data Protection
                     Laws.
                  </Text>
               </div>

               <div className="policy__block">
                  <Heading color="800" component="h3" size="sm">
                     Links to other websites
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     25. This Website may, from time to time, provide links to other websites. We have no control over
                     such websites and are not responsible for the content of these websites. This privacy policy does
                     not
                     extend to your use of such websites. You are advised to read the privacy policy or statement of
                     other websites prior to using them.
                  </Text>

                  <div className="policy__block">
                     <Heading color="800" component="h3" size="sm">
                        Changes of business ownership and control
                     </Heading>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        26. QualKey Limited may, from time to time, expand or reduce our business and this may involve
                        the
                        sale and/or the transfer of control of all or part of QualKey Ltd.. Data provided by Users will,
                        where it
                        is relevant to any part of our business so transferred, be transferred along with that part and
                        the
                        new owner or newly controlling party will, under the terms of this privacy policy, be permitted
                        to
                        use the Data for the purposes for which it was originally supplied to us.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        27. We may also disclose Data to a prospective purchaser of our business or any part of it.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        28. In the above instances, we will take steps with the aim of ensuring your privacy is
                        protected.
                     </Text>
                  </div>

                  <div className="policy__block">
                     <Heading color="800" component="h3" size="sm">
                        Cookies
                     </Heading>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        29. This Website may place and access certain Cookies on your computer. QualKey Ltd. uses
                        Cookies
                        to improve your experience of using the Website and to improve our range of products. QualKey
                        Ltd. has carefully chosen these Cookies and has taken steps to ensure that your privacy is
                        protected
                        and respected at all times.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        30. All Cookies used by this Website are used in accordance with current UK and EU Cookie Law.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        31. Before the Website places Cookies on your computer, you will be presented with a message bar
                        requesting your consent to set those Cookies. By giving your consent to the placing of Cookies,
                        you
                        are enabling QualKey Ltd. to provide a better experience and service to you. You may, if you
                        wish,
                        deny consent to the placing of Cookies; however certain features of the Website may not function
                        fully or as intended.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        33. This Website may place the following Cookies:
                     </Text>
                     <div className="policy__definition">

                        <div className="policy__definition--item">
                           <Text bold color="800" component="p"
                                 size="paragraph">
                              Strictly necessary cookies
                           </Text>
                           <Text thin color="800" component="p"
                                 size="paragraph">
                              These are cookies that are required for the operation of our website.
                              They include, for example, cookies that enable you to log into secure
                              areas of our website, use a shopping cart or make use of e-billing
                              services.
                           </Text>
                        </div>

                        <div className="policy__definition--item">
                           <Text bold color="800" component="p"
                                 size="paragraph">
                              Functionality cookies
                           </Text>
                           <Text thin color="800" component="p"
                                 size="paragraph">
                              These are used to recognise you when you return to our website. This enables us to
                              personalise our content for you, greet you by name and remember your preferences (for
                              example, your choice of language or region). By
                              using the Website, you agree to our placement of functionality cookie.
                           </Text>
                        </div>

                     </div>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        33. You can find a list of Cookies that we use in the Cookies Schedule.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        34. You can choose to enable or disable Cookies in your internet browser. By default, most
                        internet browsers accept Cookies but this can be changed. For further details, please see the
                        help menu in your internet browser. You can switch off Cookies at any time, however, you may
                        lose any information that enables you to access the Website more quickly and efficiently.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        35. You can choose to delete Cookies at any time; however, you may lose any information that
                        enables you to access the Website more quickly and efficiently including, but not limited to,
                        personalisation settings.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        36. It is recommended that you ensure that your internet browser is up-to-date and that you
                        consult the help and guidance provided by the developer of your internet browser if you are
                        unsure about adjusting your privacy settings.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        37. For more information generally on cookies, including how to disable them, please refer to
                        aboutcookies.org. You will also find details on how to delete cookies from your computer.
                     </Text>
                  </div>

                  <div className="policy__block">
                     <Heading color="800" component="h3" size="sm">
                        General
                     </Heading>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        38. You may not transfer any of your rights under this privacy policy to any other person. We
                        may
                        transfer our rights under this privacy policy where we reasonably believe your rights will not
                        be
                        affected.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        39. If any court or competent authority finds that any provision of this privacy policy (or part
                        of any
                        provision) is invalid, illegal or unenforceable, that provision or part-provision will, to the
                        extent
                        required, be deemed to be deleted, and the validity and enforceability of the other provisions
                        of this
                        privacy policy will not be affected.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        40. Unless otherwise agreed, no delay, act or omission by a party in exercising any right or
                        remedy
                        will be deemed a waiver of that, or any other, right or remedy.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        41. This Agreement will be governed by and interpreted according to the law of England and
                        Wales.
                        All disputes arising under the Agreement will be subject to the exclusive jurisdiction of the
                        English
                        and Welsh courts.
                     </Text>
                  </div>

                  <div className="policy__block">
                     <Heading color="800" component="h3" size="sm">
                        Changes to this privacy policy
                     </Heading>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        42) Qualkey Limited reserves the right to change this privacy policy as we may deem necessary
                        from time to time or as may be required by law. Any changes will be immediately posted on the
                        Website and you are deemed to have accepted the terms of the privacy policy on your first use of
                        the Website following the alterations.
                     </Text>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        You may contact Qualkey Limited by email at info@qualkey.org.
                     </Text>
                  </div>

                  <div className="policy__block">
                     <Heading color="800" component="h3" size="sm">
                        List of used Cookies
                     </Heading>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        Below is a list of the cookies that we use. We have tried to ensure this is complete and up to
                        date, but if
                        you think that we have missed a cookie or there is any discrepancy, please let us know.
                     </Text>
                     <Heading color="800" component="h3" size="sm">
                        Strictly necessary
                     </Heading>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        We use the following strictly necessary cookies:
                     </Text>
                     <div className="policy__definition">

                        <div className="policy__definition--item">
                           <Text bold color="800" component="p"
                                 size="paragraph">
                              hCaptcha
                           </Text>
                           <Text thin color="800" component="p"
                                 size="paragraph">
                              We use the hCaptcha anti-bot service (hereinafter &quot;hCaptcha&quot;) on our website. This service
                              is provided by Intuition Machines, Inc., a Delaware US Corporation (&quot;IMI&quot;). hCaptcha is
                              used to check whether the data entered on our website (such as on a login page or contact
                              form) has been entered by a human or by an automated program. To do this, hCaptcha
                              analyzes the behavior of the website or mobile app visitor based on various
                              characteristics. This analysis starts automatically as soon as the website or mobile app
                              visitor enters a part of the website or app with hCaptcha enabled. For the analysis,
                              hCaptcha evaluates various information (e.g. IP address, how long the visitor has been on
                              the website or app, or mouse movements made by the user). The data collected during the
                              analysis will be forwarded to IMI. hCaptcha analysis in the &quot;invisible mode&quot; may take
                              place completely in the background. Website or app visitors are not advised that such an
                              analysis is taking place if the user is not shown a challenge. Data processing is based on
                              Art. 6(1)(f) of the GDPR (DSGVO): the website or mobile app operator has a legitimate
                              interest in protecting its site from abusive automated crawling and spam. IMI acts as a
                              &quot;data processor&quot; acting on behalf of its customers as defined under the GDPR, and a
                              &quot;service provider&quot; for the purposes of the California Consumer Privacy Act (CCPA). For
                              more information about hCaptcha and IMI&apos;s privacy policy and terms of use, please visit
                              the following links: https://www.hcaptcha.com/privacy and https://www.hcaptcha.com/terms.
                           </Text>
                        </div>
                     </div>
                     <Heading color="800" component="h3" size="sm">
                        Functionality
                     </Heading>
                     <Text thin color="800" component="p"
                           size="paragraph">
                        We use the following functionality cookies:
                     </Text>
                     <div className="policy__definition">

                        <div className="policy__definition--item">
                           <Text bold color="800" component="p"
                                 size="paragraph">
                              first_login
                           </Text>
                           <Text thin color="800" component="p"
                                 size="paragraph">
                              To detect if user needs to set password during the first login.
                           </Text>
                        </div>
                        <div className="policy__definition--item">
                           <Text bold color="800" component="p"
                                 size="paragraph">
                              jwt
                           </Text>
                           <Text thin color="800" component="p"
                                 size="paragraph">
                              Session token for controlling user authentication and access rights on the frontend.
                           </Text>
                        </div>
                        <div className="policy__definition--item">
                           <Text bold color="800" component="p"
                                 size="paragraph">
                              remember_me
                           </Text>
                           <Text thin color="800" component="p"
                                 size="paragraph">
                              Cookie which helps to handle refreshing of the jwt if active.
                           </Text>
                        </div>
                        <div className="policy__definition--item">
                           <Text bold color="800" component="p"
                                 size="paragraph">
                              credentialShare
                           </Text>
                           <Text thin color="800" component="p"
                                 size="paragraph">
                              To persist UI state when credentials were shared.
                           </Text>
                        </div>
                        <div className="policy__definition--item">
                           <Text bold color="800" component="p"
                                 size="paragraph">
                              credentialActivation
                           </Text>
                           <Text thin color="800" component="p"
                                 size="paragraph">
                              To persist UI state when getting redirected to payment page.
                           </Text>
                        </div>
                        <div className="policy__definition--item">
                           <Text bold color="800" component="p"
                                 size="paragraph">
                              publicShare
                           </Text>
                           <Text thin color="800" component="p"
                                 size="paragraph">
                              To persistUI state when public share takes place.
                           </Text>
                        </div>
                        <div className="policy__definition--item">
                           <Text bold color="800" component="p"
                                 size="paragraph">
                              qualkey
                           </Text>
                           <Text thin color="800" component="p"
                                 size="paragraph">
                              Root cookie for consent.
                           </Text>
                        </div>
                     </div>
                  </div>

               </div>

            </div>
         </MainLayout>
      </>
   )
}

export default Policy

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const { req, res } = ctx

   res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
   )

   const shareId = getCookie("credentialShare", ctx)

   if (shareId) {
      return {
         props:
            { userData: { role: "SHARED" }, shareId }
      }
   }

   try {
      const userResponse = await axios.get(`${apiUrl}/user/me`, {
         withCredentials: true,
         headers: { Cookie: req.headers.cookie || "" }
      })
      const { data: userData } = userResponse

      const actionResponse = await axios.get(`${apiUrl}/action`, {
         withCredentials: true,
         headers: { Cookie: req.headers.cookie || "" }
      })
      const { data: actionData } = actionResponse

      return { props: { userData, actionData } }

   } catch (err) {
      if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
         return { props: { serverErrorMessage: "Network error, connection refused" } }
      }
      if (err.response.status === 401) {
         return { props: { userData: { role: "PUBLIC" } } }
      }
      return { props: {} }
   }
}