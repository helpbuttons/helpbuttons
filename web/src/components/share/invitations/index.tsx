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
import Btn, { IconType } from 'elements/Btn';
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
            <div className="form__label">
              {t('share.explainInvitations')}
              
            </div>
          <Btn
            onClick={() => {
              getNewQrCode();
            }}
            caption={invitations.length}
            iconLeft={IconType.svg}
            iconLink={<IoAdd />}
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
      display: 'flex',
      flexDirection: 'column',
      padding: '0px 10px',
      paddingTop: '10px',
      alignItems: 'center',
      fontSize: '14px',
      height: '165px',
      minWidth: '140px',
      maxWidth: '160px',
      border: '0px solid selectedNetwork.borderColor',
      borderColor: selectedNetwork.borderColor,
      backgroundColor: selectedNetwork.backgroundColor,
      boxSizing: 'border-box',
      borderRadius: '20px',
      gap:'10px',

    },
    networkTitleText: {

      minHeight: '2px',
      width: '100%',
      position: 'relative',
      alignContent:'center',
      textAlign: 'center',
      paddingBottom:'40px',
      paddingTop:'0',


    },
    networkLogo: {
      maxHeight: '25px',
      maxWidth: '25px',
      minHeight: '35px',
      minWidth: '35px',
      display: 'none',
    },
    networkHeader: {
      backgroundColor: selectedNetwork.backgroundColor,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      gap: '0px',
      height: 'auto',
      padding: '30px',
      boxsizing: 'border-box',
      paddingBottom: '10px',
      paddingTop: '10px',
    },
    invitationCard: {
      maxWidth: '100%',
      padding: '0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent:'center',
      alignContent: 'center',
      minHeight: 'auto',
      height: '130px',
      overflowX: 'hidden',
      boxSizing: 'border-box',

    },
    qrDiv: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontSize: '10px',
      // overflow: 'hidden',
      minWidth: '90px',
      minHeight: '90px',
      justifyContent: 'center',
      alignContent: 'center',
      backgroundColor: 'white',
      borderRadius: '5px',
      boxSizing: 'border-box',
      margin: 'auto',
      wordWrap: 'break-word',      // Ensure that words can break
      overflowWrap: 'break-word',  // Handle breaking in most browsers

    },
    textDiv: {
      display: 'flex',
      position:'relative',
      flexDirection: 'column',
      width: '160px',
      fontSize: '11px',
      flexWrap: 'wrap',
      height: 'auto',
      gap: '5px',
      left: '10px',
      textOverflow: 'ellipsis',
      boxSizing: 'border-box',
      marginLeft: '10px',
      marginTop: '20px',
      textAlign:'left',
      alignContent:'center',
    },
    qrCode: {
      whiteSpace: 'normal',    
      wordBreak: 'break-all',
      paddingTop: '10px',
      maxWidth: '100%',
          // Allow text to wrap to the next line
      // hyphens: 'auto',             // Add hyphenation to break long words
      flexWrap: 'wrap',
      width: '150px',
      fontSize:'8px',
    },
    networkTitle: {
      fontWeight: 'bold',
      alignContent: 'center',
      paddingTop: '0',
    }
  });

  return (
    <View style={styles.cardWrapper}>

      <View style={styles.invitationCard}>
        <View style={styles.networkTitle}>
          <Text style={styles.networkTitleText}>{selectedNetwork.name}</Text>
        </View>
        <View style={styles.qrDiv}>
          <Image src={qrCodeImage} />
        </View>
        <Text style={styles.qrCode}>{qrCode}</Text>
      </View>
    </View>
  );
};
