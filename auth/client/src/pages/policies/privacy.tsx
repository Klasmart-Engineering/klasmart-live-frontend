import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { FormattedMessage } from "react-intl";
import KidsloopLogo from "../../assets/img/kidsloop_icon.svg";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
    }));


export default function PrivacyNotice() {
    const classes = useStyles();

    interface TypgraphyProps {
        children: React.ReactNode;
    }

    function Title(props: TypgraphyProps) {
        return (
            <Grid item>
                <Typography variant="h6">
                    {props.children}
                </Typography>
            </Grid>
        )
    }

    function Paragraph(props: TypgraphyProps) {
        return (
            <Grid item>
                <Typography variant="caption">
                    {props.children}
                </Typography>
            </Grid>
        )
    }

    function List(props: TypgraphyProps) {
        return (
            <Grid container>
                <Grid item component="ul">
                    <Typography variant="caption" component="li">
                        {props.children}
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    return (
        <Grid container direction="column" spacing={2}>
            <Paragraph>
                This privacy notice explains our practices, your choices regarding the collection, use, and disclosure of certain information, including your personal information, by Kidsloop Co., Ltd. (hereinafter referred to as <i>Kidsloop</i>).
            </Paragraph>
            <Title>
                Contacting Us
            </Title>
            <Paragraph>
                If you have general questions about your account or how to contact customer service for assistance, as well as questions specifically about this privacy notice or our use of your personal information, cookies or similar technology, please contact our Data Protection Officer, <i>Ethan, HeeSeob Jeong</i>, by email at <a href="mailto:calm_privacy@calmid.com">calm_privacy@calmid.com</a>.
            </Paragraph>
            <Paragraph>
                The data controller of your personal information is Kidsloop. Please note that if you contact us to assist you, for your safety and ours, we may need to authenticate your identity before fulfilling your request.
            </Paragraph>
            <Title>
                Collection of Information
            </Title>
            <Paragraph>
                We receive and store information about you, such as:
            </Paragraph>
            <List>
                Information provided by the user: We collect information you provide to us, which includes:
                <List>
                    Name, email, gender, birth date, ID, password, telephone number, country, nationality, language, IMEI, IP address (IP location), Connection Information (CI), Duplication Information (DI), payment method(s), etc. For minors, the above information regarding their legal representative (name, date of birth, CI, DI, etc. of the legal representative)
                </List>
                <List>
                    Member name, address, age, registered organization and email, detail of subscription and KidsLoop content use (content classification (books, applications and videos), content titles, content usage time in hours, days and months, attendance (class classification, class titles, schedule, achievement and member evaluation)) for analysis of how members use the content and service suggestions
                </List>
                <List>
                    Pictures, audio and videos for application services
                </List>
                <List>
                    Name and telephone number to provide learners with development history and analytic results according to the Learning Lab use
                </List>
            </List>
            <List>
                Information collected while the user is using the services: Besides the information directly provided by the user, Kidsloop can collect information while the user is using Kidsloop’s KidsLoop service and application services, such as:
                <List>
                    Equipment information such as records on the use of and access to KidsLoop services, verification records, access IP information, unique number for equipment identification (eg. equipment ID), OS information (country, language), application version, etc.
                </List>
                <List>
                    Log information such as IP address, log data, usage time, internet protocol address, cookies and web beacons, etc.
                </List>
                <List>
                    Other information, such as preferences and visited pages, regarding the user’s KidsLoop service use, play time of videos and audio, time spent on activities, Bada Pen data, quiz results, location where photos are taken, date of file creation, etc.
                </List>
            </List>
            <List>
                Information provided by Partners: Kidsloop receives information from other companies with which its members have made a contract (hereinafter referred to as the “Partners”). The Partners include all companies furnishing the Learning Lab services, such as Learning Park, Kindergarten Solution, etc. The information that the Partners provide for Kidsloop can differ depending on the nature of the Partners’ services and include as follows:ollect information while the user is using Kidsloop’s KidsLoop service and application services, such as:
                <List>
                    Name and birth date of learners (children)
                </List>
                <List>
                    Name and phone number of their legal representative
                </List>
                <List>
                    Pictures of learners (children) for Social Feed Service
                </List>
            </List>
            <List>
                Information from other sources: Kidsloop also obtains information from other sources. Kidsloop protects this information according to the practices described in this privacy notice, plus any additional restrictions imposed by the source of the data. These sources vary over time, but may include:
                <List>
                    Payment service providers who provide Kidsloop with payment information, or updates to that information, based on their relationship with the company
                </List>
            </List>
            <Title>
                Method of Collection
            </Title>
            <Paragraph>
                Kidsloop collects information of the users in the following manner (under GDPR 6(1)(a)):
            </Paragraph>
            <List>
                Through websites and mobile devices with prior consent from the users
            </List>
            <Title>
                Use of Information
            </Title>
            <Paragraph>
                We use information to provide, analyze, administer, enhance and personalize our KidsLoop services and marketing efforts, to process your registration, orders and payments, and to communicate with you on these and other topics. For example, we use information to:
            </Paragraph>
            <List>
                Detect and deter unauthorized or fraudulent use of or abuse of KidsLoop services such as member management, identification, etc.
            </List>
            <List>
                Perform contractual obligations and facilitate the payment and settlement of KidsLoop service fees in relation to the services demanded by the users
            </List>
            <List>
                Improve existing services and develop new services
            </List>
            <List>
                Notify of changes, if any, in the notice or functionality of Kidsloop’s website or applications
            </List>
            <List>
                Allow a user to search, be notified of and automatically register his or her friends whose contact information is saved on the user’s mobile phone, or to search and be notified of other users he or she might know
            </List>
            <List>
                Create statistics on the usage of KidsLoop services to provide profiling services based on the statistical properties
            </List>
            <List>
                Provide information on promotional events and opportunities to participate therein; or
            </List>
            <List>
                Comply with applicable laws or legal obligations
            </List>
            <Title>
                Disclosure of Information
            </Title>
            <Paragraph>
                We disclose your information for certain purposes to third parties, as described below:
            </Paragraph>
            <List>
                Service Providers: We use other companies, agents or contractors (“Service Providers”) to perform services on our behalf or to assist us with the provision of services. For example, we engage Service Providers to provide marketing, advertising, communications, infrastructure and IT services, personalize and optimize our service, process credit card transactions or other payment methods, provide customer service, collect debts, analyze and enhance data (including data about users’ interactions with our service), and process and administer consumer surveys. In the course of providing such services, these Service Providers may have access to your personal or other information. We do not authorize them to use or disclose your personal information except in regards to providing their services.
            </List>
            <List>
                Partners: Users may have a contract with one or more of our Partners, in which case we may share certain information to coordinate on providing our services, and information regarding them, to members. For example, depending on what Partner services you use, we may share information:
                <List>
                    In order to facilitate Partners’ collection and distribution of payment to Kidsloop
                </List>
                <List>
                    With Partners who operate voice assistant platforms that allow you to interact with our service using voice commands
                </List>
                <List>
                    So that content and features available in the Kidsloop service can be suggested to you in the Partner’s user interface. For members, these suggestions are part of the Kidsloop service and may include customized and personalized viewing recommendations
                </List>
                <List>
                    Such as pictures of the learner (child) that Partners provide to teachers for the Social Feed service
                </List>
            </List>
            <List>
                Promotional offers: We may offer joint promotions or programs that, in order for your participation, will require us to share your information with third parties. In the process, we may share your name and other information in order to provide the promotional offers. Please note that these third parties are responsible for their own privacy practices.
            </List>
            <List>
                Protection of Kidsloop and third parties: Kidsloop and its Service Providers may disclose and otherwise use your personal and other information where we or they reasonably believe such disclosure is needed to (a) satisfy any applicable law, regulation, legal process, or governmental request, (b) enforce applicable terms of use, including investigation of potential violations thereof, (c) detect, prevent, or otherwise address illegal or suspected illegal activities (including payment fraud), security or technical issues, or (d) protect against harm to the rights, property or safety of Kidsloop, its users or the public, as required or permitted by law.
            </List>
            <List>
                Business transfers: With any reorganization, restructuring, mergers or sales, or other transfer of assets, we will transfer information, including personal information, provided that the receiving party agrees to respect your personal information in a manner that is consistent with our privacy statement.
            </List>
            <Paragraph>
                Whenever in the course of sharing information we transfer personal information to countries outside of the European Economic Area and other regions with comprehensive data protection laws, we will ensure that the information is transferred in accordance with this privacy notice and as permitted by the applicable laws on data protection. Personal information transferred (such as name and contact information) may be saved electronically on servers operated by our Service Providers for record keeping purposes and other purposes as set out in this privacy notice.
            </Paragraph>
            <Title>
                Need to Disclose Personal Information
            </Title>
            <Paragraph>
                Personal information provided by users is a requirement for the KidsLoop service use contract between a user and Kidsloop so that Kidsloop can provide the users with great services. Users may be restricted in using Kidsloop’s KidsLoop services unless they give consent to the collection of required personal information. Refusing the collection of optional information may lead to restrictions in the usage of Kidsloop services, such that access may be limited to services which do not require consent to the collection of optional information.
            </Paragraph>
            <Title>
                Overseas Transfer of Data
            </Title>
            <Paragraph>
                Kidsloop can disclose users’ personal information to companies located in other countries for any purpose specified in this notice. Kidsloop will take reasonable protection measures to ensure safety when handling data with the companies where information is transmitted, retained or processed. Kidsloop discloses users’ personal information in accordance with documents including standard clauses of personal data protection approved or adopted by the recipient of personal data or the European Committee (under GDPR 46).
            </Paragraph>
            <Title>
                Users’ Rights
            </Title>
            <Paragraph>
                Users or their legal representatives, as main agents of the information, can exercise the following rights regarding the collection, use and disclosure of personal information by Kidsloop:
            </Paragraph>
            <List>
                The right to access by the data subject (under GDPR 15);
            </List>
            <List>
                The right to rectification and (under GDPR 16)
            </List>
            <List>
                The right to erasure (under GDPR 17)
            </List>
            <List>
                The right to restriction of processing (under GDPR 18)
            </List>
            <List>
                The right to data portability (under GDPR 20)
            </List>
            <List>
                The right to object (under GDPR 21)
            </List>
            <List>
                The right not to be subject to automated individual decision-making, including profiling (under GDPR 22)
            </List>
            <List>
                The right to request the withdrawal of prior consent (under GDPR 7(3))
            </List>
            <Paragraph>
                If, in order to exercise any of the foregoing rights, a user contacts Kidsloop (or the data protection officer) through the account or user information portion of the website, in writing, or by email or phone, Kidsloop will immediately take action accordingly, provided that Kidsloop may reject such request if, and to the extent, there are reasonable grounds prescribed in law or equivalent thereto.
            </Paragraph>
            <Paragraph>
                Also, the users or their legal representatives have the right to lodge a complaint with a supervisory authority (under GDPR 13(2), GDPR 14(2)(e)).
            </Paragraph>
            <Title>
                Security
            </Title>
            <Paragraph>
                KidsLoop takes the security of personal information seriously. It has the following security measures to prevent unauthorized access to, or disclosure, use or change of, personal information (under GDPR 32).
            </Paragraph>
            <List>
                To encrypt personal information
            </List>
            <List>
                To transmit users’ personal information through an encryption zone
            </List>
            <List>
                To keep essential information encrypted such as passwords
            </List>
            <List>
                Authentication security strategy: authentication sessions
            </List>
            <List>
                Hashing user passwords in the database
            </List>
            <List>
                SSL certificate managed with AWS Certificate Manager
            </List>
            <List>
                To formulate countermeasures against hacking
            </List>
            <List>
                To install systems in a secure zone to which external access is strictly restricted so as to prevent users’ personal information from leakage or damage by being hacked or computer viruses
            </List>
            <List>
                To establish and implement internal management plans
            </List>
            <List>
                To conduct regular internal audit (once a quarter) to safely process personal information
            </List>
            <List>
                To install and operate access control systems
            </List>
            <List>
                To take necessary actions to restrict the access to personal information, such as granting, changing or terminating permissions to access database systems which include such information
            </List>
            <List>
                To keep the documents, storage devices, etc. which include personal information in a safe place with a lock
            </List>
            <List>
                To designate a physical place for storing personal information to restrict the access by unauthorized persons and to establish and operate such access control procedure
            </List>
            <List>
                Rest API Security with AWS: API Gateways
            </List>
            <List>
                DynamoDB user data security with AWS: Databases
            </List>
            <List>
                To take measures to prevent forgery or alteration of access records
            </List>
            <Title>
                Children
            </Title>
            <Paragraph>
                In principle, Kidsloop does not collect any information from children under 13 or those considered to be below of age under law. However, if Kidsloop collects any personal information of children under 13 or those considered to be below of age under relevant law for the services provided by Kidsloop, including without limitation the Learning Lab, KidsLoop, various application services and Social Feed services. It will comply with the following procedures for the protection of children’s personal information (under GDPR 8):
            </Paragraph>
            <List>
                To verify if a child is subject to the guardian’s consent and such guardian is authorized, within the scope of reasonable efforts
            </List>
            <List>
                To have consent from a child’s parent or guardian to collect the child’s personal information or to provide the child with product information and Kidsloop’s services directly
            </List>
            <List>
                To notify parents or the guardian of Kidsloop’s privacy policy for children, including the items, purpose and disclosure of collected personal information
            </List>
            <List>
                To grant a child’s legal representative the right to access, correct, delete, or temporarily suspend the processing of the child’s personal information or the right to withdraw the prior consent of the representative
            </List>
            <List>
                To limit the collection of personal information to the extent solely required for participation in online activities
            </List>
            <Title>
                Profiling
            </Title>
            <Paragraph>
                Kidsloop may use users’ personal information to create individual or collective profiles (hereinafter referred to as “profiling”) for the purpose of identifying how to provide the users with better KidsLoop services; for example, this would include providing the users with customized content of KidsLoop services by analyzing what attracts the users most regarding Kidsloop and the KidsLoop services rendered by Kidsloop, and how the users use the services. In addition, Kidsloop uses personal data for the following purposes: to create user clusters to identify users’ interest in the Kidsloop products and/or services, to analyze the market and statistics, or to enhance Kidsloop’s services (all websites, etc.). It may integrate the data provided by all its websites and applications with the users’ personal data provided by the Learning Lab. The processing of personal data for profiling is carried out in compliance with that specified in applicable laws (under GDPR 22).
            </Paragraph>
            <Title>
                Data Retention
            </Title>
            <Paragraph>
                Kidsloop will keep personal information in a form which permits identification of data subjects for no longer than is necessary for the purposes for which personal data is processed. Once this time period has expired, Kidsloop will delete personal information within one year from the expiration. Personal data may be stored for longer periods insofar as the personal data is processed solely for archiving purposes in the public interest, scientific or historical research purposes, or statistical purposes subject to implementation of the appropriate technical and organisational measures required by this regulation in order to safeguard the rights and freedom of the data subject (under GDPR 5(1)(e)).
            </Paragraph>
            <Title>
                Data Retention
            </Title>
            <Paragraph>
                Kidsloop will keep personal information in a form which permits identification of data subjects for no longer than is necessary for the purposes for which personal data is processed. Once this time period has expired, Kidsloop will delete personal information within one year from the expiration. Personal data may be stored for longer periods insofar as the personal data is processed solely for archiving purposes in the public interest, scientific or historical research purposes, or statistical purposes subject to implementation of the appropriate technical and organisational measures required by this regulation in order to safeguard the rights and freedom of the data subject (under GDPR 5(1)(e)).
            </Paragraph>
            <Title>
                Modification of Privacy Notice
            </Title>
            <Paragraph>
                Kidsloop has the right to amend or modify this privacy notice from time to time, in which case, Kidsloop will make a public notice through the website (or through individual notice in writing or by fax or email) and obtain consent from the users when required by relevant laws.
            </Paragraph>
            <Title>
                Cookies and Internet Advertising
            </Title>
            <Paragraph>
                Kidsloop may collect collective and impersonal information through cookies or web beacons. Cookies are substantially small text files sent to the users’ browser by the server used for the operation of the Kidsloop’s websites and are stored in hard-disks of the users’ computers. Web beacons are a small quantity of code which exists on websites and email. By using web beacons, we can identify whether a user has interacted with certain websites or contents of email. These functions are used for evaluating, improving services and customizing user experience so that Kidsloop can provide enhanced KidsLoop services to users.
            </Paragraph>
            <Paragraph>
                Cookies collected by Kidsloop and the purpose of such collection are as follows:
            </Paragraph>
            <List>
                Required cookies: These are necessary for users to use the functions of Kidsloop’s website. No services, such as shopping cart or electronic bill payment, can be provided for a user unless he or she accepts these cookies. These cookies do not collect any information which can be used for marketing purposes, nor do they store the sites that users have visited.
                <List>
                    To retain the information entered in an order form while searching other webpages during the web browser session
                </List>
                <List>
                    To retain information regarding purchased services within the product and checkout webpages
                </List>
                <List>
                    To verify whether a user logs in to the website
                </List>
                <List>
                    To ensure that a user is connected to the correct service on Kidsloop’s website if Kidsloop makes any changes in the operation of the Kidsloop website
                </List>
                <List>
                    To connect users to certain applications or the server of the services
                </List>
            </List>
            <List>
                Performance cookies: These collect information of how the users use Kidsloop’s website, such as webpages most frequently visited by the users. Such data helps Kidsloop optimize its website so that the users can search more conveniently. Such cookies do not collect any information regarding users’ identification. All or any information collected by performance cookies is anonymous since the information is collectively processed.
                <List>
                    Web analysis: to provide statistical data on how the website is used
                </List>
                <List>
                    Advertisement response: to confirm the effect of Kidsloop’s advertisement
                </List>
                <List>
                    Tracing affiliates: to provide Kidsloop’s affiliates with feedback of anonymous information that one of the visitors of Kidsloop’s website has visited an affiliate’s website
                </List>
                <List>
                    Error management: to identify errors which have occurred in order to improve Kidsloop’s website
                </List>
                <List>
                    Design testing: to test other designs of Kidsloop’s website
                </List>
            </List>
            <List>
                Functionality cookies: These are used to store configurations so as to provide services and improve user experience. No information collected by these cookies identifies individual users.
                <List>
                    To store changed configurations such as layout, text size, colors
                </List>
                <List>
                    To store surveys conducted by Kidsloop and completed by the users
                </List>
            </List>
            <List>
                Target cookies: These are connected with services provided by third parties such as the buttons for ‘likes’ and ‘share’. The third party recognizes the users’ visit to Kidsloop’s website to provide such services.
                <List>
                    To allow social network connected to such cookies to use the users’ visit information, thus placing advertisements targeting the users
                </List>
                <List>
                    To provide the users’ visit information for advertisement agencies so that the agencies can suggest tailored ads which can attract the interest of the users
                </List>
            </List>
            <Paragraph>
                The users have options for enabling cookies: accepting all cookies, confirming whenever a cookie is saved, or refusing the storage of all cookies. However, such refusal by a user may result in limited access to parts of Kidsloop’s services.
            </Paragraph>
            <Paragraph>
                <br/>
            </Paragraph>
            <Paragraph>
                Last updated: 2020-10-21
            </Paragraph>
        </Grid>
    );
}