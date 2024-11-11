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
import Popup from 'components/popup/Popup';
import { PdfIframe, usePdfGenerateBlob } from '../pdf';
import { getShareLink, makeImageUrl } from 'shared/sys.helper';
import { useSelectedNetwork } from 'state/Networks';
import { Network } from 'shared/entities/network.entity';
import QRCode from 'qrcode';
import Loading from 'components/loading';
import { CreateInvite } from 'state/Users';
import { store } from 'pages';

export default function ShareInvitationsForm() {
  const selectedNetwork: Network = useSelectedNetwork();
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
        {t('share.explainInvitations')}
        <div>
        {invitations.length}
        </div>
        <Btn
          onClick={() => {
            getNewQrCode();
          }}
          iconLeft={IconType.svg}
          iconLink={<IoAdd />}
        />
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
      padding: '0px',
      fontSize: '14px',
      height: 'auto',
      minWidth: '295px',
      borderRadius: '5px',
      border: '0px solid selectedNetwork.borderColor',
      borderColor: selectedNetwork.borderColor,
      boxSizing: 'border-box',

    },
    networkLogo: {
      maxHeight: '25px',
      maxWidth: '25px',
      minHeight: '35px',
      minWidth: '35px',
    },
    networkHeader: {
      backgroundColor: selectedNetwork.backgroundColor,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '20px',
      height: 'auto',
      padding: '10px',
    },
    invitationCard: {
      maxWidth: '100%',
      padding: '15px',
      paddingTop: '0px',
      paddingRight: '0px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent:'space-between',
      minHeight: 'auto',
      height: '150px',
      overflowX: 'hidden',
      boxSizing: 'border-box',

    },
    qrDiv: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      height: 'auto',
      right: '10px',
      fontSize: '10px',
      // overflow: 'hidden',
      width: '95px',
      minHeight: '150px',
      alignContent: 'flex-start',
      justifyContent: 'center',
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
      display: 'flex',
      whiteSpace: 'normal',    
      wordBreak: 'break-all',

          // Allow text to wrap to the next line
      // hyphens: 'auto',             // Add hyphenation to break long words
      flexWrap: 'nowrap',
      position: 'absolute',
      width: '100%',
      fontSize:'10px',
      bottom:'10px',
    },
    networkTitle: {
      display: 'flex',
      flexDirection: 'column',
      fontWeight: 'bold',
      gap: '5px',
    }
  });

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.networkHeader}>
        <Image
          style={styles.networkLogo}
          src={makeImageUrl(selectedNetwork.image)}
        />
        <View style={styles.networkTitle}>
          <Text>{selectedNetwork.name}</Text>
          <Text>{t('invitation.card')}</Text>
        </View>
      </View>
      <View style={styles.invitationCard}>
        <View style={styles.textDiv}>
          <Text>{t('invitation.infoCard')}</Text>
          <Text>{t('invitation.name')}</Text>
          <Text>{t('invitation.contact')}</Text>
          <Text>{t('invitation.infoQr')}</Text>
        </View>
        <View style={styles.qrDiv}>
          <Image src={qrCodeImage} />
        </View>
        <Text style={styles.qrCode}>{qrCode}</Text>
      </View>
    </View>
  );
};