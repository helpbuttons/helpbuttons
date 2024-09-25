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
import { IoSearch } from 'react-icons/io5';
import Popup from 'components/popup/Popup';
import { PdfIframe, usePdfGenerateBlob } from '../pdf';
import { FilterByNumber } from 'components/search/AdvancedFilters/filter-by-number';
import { getShareLink, makeImageUrl } from 'shared/sys.helper';
import { useSelectedNetwork } from 'state/Networks';
import { Network } from 'shared/entities/network.entity';
import QRCode from 'qrcode';

export default function ShareInvitationsForm() {
  const selectedNetwork: Network = useSelectedNetwork();

  const [pdfBlobUrl, generatePdf] = usePdfGenerateBlob(
    <Document>
      <Page size="A4">
        <InvitationsPdf selectedNetwork={selectedNetwork} />
      </Page>
    </Document>,
  );

  useEffect(() => {
    if (selectedNetwork) {
      generatePdf();
    }
  }, [selectedNetwork]);
  const [nrInvitations, setNrInvitations] = useState(1);

  return (
    <>
      <Popup>
        {t('share.explainInvitations')}
        <FilterByNumber
          number={nrInvitations}
          setNumber={setNrInvitations}
          label={nrInvitations}
          max={15}
        />
        <Btn onClick={generatePdf} caption={t('common.send')} />

        <Btn
          onClick={() => console.log('clicka-me')}
          iconLeft={IconType.svg}
          iconLink={<IoSearch />}
          caption={'caption'}
        />
        <PdfIframe blob={pdfBlobUrl} />
      </Popup>
    </>
  );
}

const InvitationsPdf = ({ selectedNetwork }) => {
  const qrCodes = ['372613213213621', '3218936218963912', '372613213213621', '372613213213621', '3218936218963912'];
  const invitations = qrCodes.map((qrCode) => {
    return {
      code: qrCode,
      qrCode: QRCode.toDataURL(
        getShareLink(`/Signup/Invite/${qrCode}`),
      ),
    };
  });

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
      {invitations.map((invitation) => (
        <InvitationCard
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
      position:'absolute',
      height: 'auto',
      right: '10px',
      fontSize: '10px',
      overflowY:'hidden',
      width: '95px',
      minHeight: '150px',
      alignContent: 'flex-start',
      justifyContent: 'center',
    },
    textDiv: {
      display: 'flex',
      position:'absolute',
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
          <Text>{qrCode}</Text>
        </View>
      </View>
    </View>
  );
};
