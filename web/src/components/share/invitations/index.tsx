import t from 'i18n';
import React, { useEffect, useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import Btn, { BtnType, IconType } from 'elements/Btn';
import { IoAdd } from 'react-icons/io5';
import { PdfIframe, usePdfGenerateBlob } from '../pdf';
import { getShareLink, makeImageUrl } from 'shared/sys.helper';
import QRCode from 'qrcode';
import Loading from 'components/loading';
import { CreateInvite } from 'state/Profile';
import { GlobalState, store } from 'state';
import { useGlobalStore } from 'state';

export default function ShareInvitationsForm() {

  const selectedNetwork = useGlobalStore((state: GlobalState) => state.networks.selectedNetwork)
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (invitations) {
      setLoading(() => false);
    }
  }, [invitations]);
  const [pdfBlobUrl, setPdfBlobUrl, generatePdf] = usePdfGenerateBlob(
    <Document>
      <Page size="A4">
        <InvitationsPdf
          selectedNetwork={selectedNetwork}
          invitations={invitations}
        />
      </Page>
    </Document>,
  );

  useEffect(() => {
    if (selectedNetwork) {
      generatePdf();
    }
  }, [selectedNetwork]);

  const getNewQrCode = () => {
    if (pdfBlobUrl) {
      setPdfBlobUrl(() => null);
      URL.revokeObjectURL(pdfBlobUrl);
    }

    const invitation = {
      maximumUsage: 1,
      expirationTimeInSeconds: 0,
      followMe: true,
    };
    const onGotNewInvitation = (invitation) => {
      const code = invitation.id
      
      QRCode.toDataURL(
        getShareLink(`/Signup/Invite/${code}`),
      ).then((qrCodeBlob) => {
        setInvitations((prevInvitations) => [
          ...prevInvitations,
          {
            code: code,
            qrCode:qrCodeBlob,
          }
        ]);
      })
    }
    store.emit(new CreateInvite(invitation, onGotNewInvitation))
  };

  useEffect(() => {
    generatePdf()
  }, [invitations])
  return (
        <>
          <div className="form__field">
            <div className="form__explain">
              {t('share.explainInvitations')}
            </div>
            <Btn
              onClick={() => {
                getNewQrCode();
              }}
              caption={invitations.length}
              iconLeft={IconType.svg}
              iconLink={<IoAdd />}
              btnType={BtnType.searchPickerField}
            />
        </div>

          {loading && <Loading />}
          {!loading && <PdfIframe blob={pdfBlobUrl} />}
        </>
  );
}
const InvitationsPdf = ({ selectedNetwork, invitations }) => {
  const styles = StyleSheet.create({
    invitations: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      borderColor: '#000',
      gap: '3px',
    },
  });

  return (
    <View style={styles.invitations}>
      {invitations.map((invitation, idx) => (
        <InvitationCard
          key={idx}
          selectedNetwork={selectedNetwork}
          qrCode={invitation.code}
          qrCodeImage={invitation.qrCode}
        />
      ))}
    </View>
  );
};

const InvitationCard = ({ selectedNetwork, qrCode, qrCodeImage }) => {
  const styles = StyleSheet.create({
    cardWrapper: {
      // display: 'flex',
      // flexDirection: 'column',
      padding: '10px 10px',
      // alignItems: 'center',
      fontSize: '10px',
      height: '165px',
            minHeight: '165px',
      minWidth: '195px',
      // maxWidth: '160px',
      border: '0px solid selectedNetwork.borderColor',
      borderColor: selectedNetwork.borderColor,
      backgroundColor: selectedNetwork.backgroundColor,
      borderRadius: '20px',
      

    },
    networkTitleText: {

      display: 'flex',
      flexDirection: 'column',
      // minHeight: '30px',
      // width: '100%',
      position: 'relative',
      margin: 'auto',
      fontSize:'15px',
      // zIndex: '30000',
      overFlow: 'visible',
      // alignContent:'center',
      // textAlign: 'center',
      color:  selectedNetwork.textColor,

      // paddingBottom:'40px',

    },
    // networkLogo: {
    //   maxHeight: '25px',
    //   maxWidth: '25px',
    //   minHeight: '35px',
    //   minWidth: '35px',
    //   display: 'none',
    // },
    // networkHeader: {
    //   backgroundColor: selectedNetwork.backgroundColor,
    //   display: 'flex',
    //   flexDirection: 'row',
    //   flexWrap: 'nowrap',
    //   alignItems: 'center',
    //   gap: '0px',
    //   height: 'auto',
    //   padding: '30px',
    //   boxsizing: 'border-box',
    //   paddingBottom: '10px',
    //   paddingTop: '10px',
    // },
    invitationCard: {
      // maxWidth: '100%',
      // padding: '50px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent:'center',
      alignContent: 'center',
      // maxHeight: 'auto',
      height: '160px',
      overflowX: 'hidden',
      boxSizing: 'border-box',
      position:'relative',
      gap: '10px'

    },
    qrDiv: {
      display: 'flex',
      flexDirection: 'column',
      // height: '100%',
      fontSize: '10px',
      // overflow: 'hidden',
      maxHeight: '110px',
      justifyContent: 'center',
      alignContent: 'center',
      backgroundColor: 'white',
      borderRadius: '5px',
      boxSizing: 'border-box',
      margin: 'auto',
      // wordWrap: 'break-word',      // Ensure that words can break
      // overflowWrap: 'break-word',  // Handle breaking in most browsers
      position: 'relative',

    },
    // textDiv: {
    //   display: 'flex',
    //   position:'relative',
    //   flexDirection: 'column',
    //   // width: '160px',
    //   fontSize: '11px',
    //   color:  selectedNetwork.textColor,
    //   flexWrap: 'wrap',
    //   height: 'auto',
    //   gap: '5px',
    //   left: '10px',
    //   textOverflow: 'ellipsis',
    //   boxSizing: 'border-box',
    //   marginLeft: '10px',
    //   marginTop: '20px',
    //   textAlign:'left',
    //   alignContent:'center',
    // },
    qrCode: {
      // display: 'flex',
      // whiteSpace: 'normal',    
      // wordBreak: 'break-all',
      // paddingTop: '10px',
      // maxWidth: '100px',
      color:  selectedNetwork.textColor,
          // Allow text to wrap to the next line
      // hyphens: 'auto',             // Add hyphenation to break long words
      // flexWrap: 'wrap',
      // width: '150px',
      margin:'auto',
      fontSize:'8px',
    },
    // networkTitle: {
    //   fontWeight: 'bold',
    //   alignContent: 'center',
    //   paddingTop: '0',
    // }
  });

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.invitationCard}>
          <Text style={styles.networkTitleText}>{selectedNetwork.name}</Text>
                <View style={styles.qrDiv}>
          <Image src={qrCodeImage} />
                </View>

          <Text style={styles.qrCode}>{qrCode}</Text>
      </View>
    </View>
  );
};
