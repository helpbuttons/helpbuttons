//QUESTIONS AND INFO
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import SEO from 'components/seo';
import { ServerPropsService } from 'services/ServerProps';


import NavHeader from '../../components/nav/NavHeader'

import Directory from '../../elements/Directory'
import Accordion from '../../elements/Accordion'
import Popup from 'components/popup/Popup'

export default function Faqs({
  metadata,
  selectedNetwork,
  config,
})
{

  const currentUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  return (

    <>

      <SEO {...metadata} />

      <Popup title="Faqs" linkFwd="/Explore">

        <Accordion title={"What's " + selectedNetwork.name}>
          <span className="highlight">{selectedNetwork.description}</span>.
        </Accordion>

        <Accordion title="What's Helpbuttons">
        <span className="highlight">Helpbuttons</span> is the <span className="highlight">open-source software</span> that powers this app. With Helpbuttons, you can create your own <span className="highlight">networks</span> for sharing <span className="highlight">food, housing, transportation</span>, or anything else you have in mind, and then federate with other networks to share users and resources. Helpbuttons specializes in connecting people who don't yet know each other, for various purposes, in the real world.
        </Accordion>

        <Accordion title="What's for">
          We aim to foster a <span className="highlight">cohesive society</span>, promote <span className="highlight">cooperation</span>, and optimize the design of <span className="highlight">collaborative tools</span> in order to fully leverage the advantages of the internet. In brief, we've observed the substantial amounts of money, time, and user participation required each time a new collaborative app is launched. This seems unnecessary. Most of these tools share a significant portion of their core functionalities. We believe these commonalities could be managed using the same software, simply adapted for each unique purpose through various modules.
        </Accordion>

        <Accordion title="What's a Helpbutton">
          A <span className="highlight">Helpbutton</span> refers to a <span className="highlight">post</span>. Every post published by a user in Helpbuttons is termed a helpbutton. Helpbuttons can represent <span className="highlight">offers, needs, exchanges, transport proposals, businesses</span>, and so forth. They can also be renamed to suit the specific needs of your app.
        </Accordion>

        <Accordion title="What's a Network">
        A <span className="highlight">Network</span> refers to your individual instance of Helpbuttons. You can create your own network, designate a purpose (such as <span className="highlight">sharing food, helping animals, caring for elders</span>, etc.) and begin collaborating with any group you want (be it your neighborhood, sports club, village, course mates, etc.).            
        </Accordion>

        <Accordion title="The community">
          The <span className="highlight">Helpbuttons community</span> is the backbone of this project, providing it with sustainability. This tool is designed for adaptability to a multitude of purposes, thereby benefitting a diverse range of users while also encouraging support for the project. By federating with other Helpbuttons apps, you can share users and resources. This method of <span className="highlight">collaboration</span> enables us to unite more people and ultimately improve the tool we provide.
        </Accordion>

        <Accordion title="Ethics Policies">
          At Helpbuttons, we are committed to maintaining the highest standards of <span className="highlight">ethical conduct</span>. We believe in transparency, honesty, and respect for all individuals. Our software is designed to connect people and facilitate sharing, which is a responsibility we take seriously. We encourage our users to use our platform with the same values in mind, prioritizing respectful communication and mindful sharing. Any misuse of the software, including exploitation, harm to others, or manipulation of the platform's functionalities for personal gain, will not be tolerated. Users are required to adhere to these ethics policies at all times.
        </Accordion>

        <Accordion title="Privacy Policies">
          At Helpbuttons, we respect your <span className="highlight">privacy</span> and are committed to protecting your <span className="highlight">personal data</span>. Our <span className="highlight">privacy policy</span> outlines how we collect, store, use, and disclose your personal information. We comply with all relevant privacy laws and regulations, ensuring your data is used solely for the purpose of providing and improving our service. We are transparent about our data collection processes, and you have the right to access, update, or delete your personal data at any time. Remember, sharing personal information in Helpbuttons posts is at your discretion—be mindful and only share what you are comfortable with others knowing. 
          Please direct your questions to the following email: help@helpbuttons.org
          <h2>Privacy Policy</h2>
          <ol>
              <li>
                  <h3>Information We Collect:</h3>
                  <p>
                      At Helpbuttons, we only collect information necessary to provide and enhance our service. This may include your username, contact details, and location (if given permission), as well as any data you choose to share in a Helpbutton post. If you contact us directly, we may also receive additional information about you.
                  </p>
              </li>
              <li>
                  <h3>How We Use Your Information:</h3>
                  <p>
                      We use the information we collect to provide, maintain, and improve our services. This could include showing you relevant Helpbuttons posts based on your location, ensuring the proper functioning of our app, providing customer support, or communicating with you about updates or changes to our services.
                  </p>
              </li>
              <li>
                  <h3>Federated Servers:</h3>
                  <p>
                      With your explicit consent, your data may be shared with federated servers in the Helpbuttons network. These servers are used to enhance the interoperability and reach of our services. Each federated server adheres to stringent privacy and data protection standards equivalent to ours.
                  </p>
              </li>
              <li>
                  <h3>Sharing and Disclosure:</h3>
                  <p>
                      We do not sell your personal information to third parties. We may share your information with third parties when necessary for our services (for example, server hosting), or if we are required to do so by law. If we share your information with third parties for these purposes, we ensure they are also compliant with relevant privacy laws and regulations.
                  </p>
              </li>
              <li>
                  <h3>Data Security:</h3>
                  <p>
                      We implement strict security measures to protect your personal information. While no system is completely secure, we are dedicated to keeping your data safe and continually update our security practices as necessary.
                  </p>
              </li>
          </ol>
        </Accordion>

        <Accordion title="Security Policies">
          Your security is our top priority. At Helpbuttons, we implement stringent <span className="highlight">security measures</span> to protect the integrity of our software and the safety of our users. We continually update and review our systems to ensure they meet the highest standards of cybersecurity. However, we also believe that security is a shared responsibility. We encourage our users to practice safe online behaviors, like using strong passwords and protecting personal information.
          Please direct your questions to the following email: help@helpbuttons.org
        </Accordion>

        <Accordion title="Contact">
          Please direct your questions to the following email: help@helpbuttons.org
        </Accordion>

      </Popup>

    </>


  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const serverProps = await ServerPropsService.general('Home', ctx);
    return { props: serverProps };
  } catch (err) {
    console.log(err);
    return {
      props: {
        selectedNetwork: null,
      },
    };
  }
};