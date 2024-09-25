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
import Loading from 'components/loading';

export default function ShareInvitationsForm() {
  const selectedNetwork: Network = useSelectedNetwork();
  // const qrCodes = ['372613213213621', '3218936218963912', '372613213213621', '372613213213621', '3218936218963912'];
  const [qrCodes, setQrCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [nrInvitations, setNrInvitations] = useState(1)

  useEffect(() => {
    setLoading(() => true)
    if(selectedNetwork)
    {
      //get invitation codes, for nrInvitations
    }
  }, [selectedNetwork, nrInvitations])

  useEffect(() => {
    if(qrCodes)
    {
      setLoading(() => false)
    }
  }, [qrCodes])
  const [pdfBlobUrl, generatePdf] = usePdfGenerateBlob(
    <Document>
      <Page size="A4">
        <InvitationsPdf selectedNetwork={selectedNetwork} qrCodes={qrCodes}/>
      </Page>
    </Document>,
  );

  useEffect(() => {
    if (selectedNetwork) {
      generatePdf();
    }
  }, [selectedNetwork]);

  return (
    <>
      <Popup>
        {t('share.explainInvitations')}
        {/* <FilterByNumber
          number={nrInvitations}
          setNumber={setNrInvitations}
          label={nrInvitations}
          max={15}
        /> */}
        {/* <Btn iconLink={<}/> */}
        {loading && <Loading/>}
        {!loading && <PdfIframe blob={pdfBlobUrl} />}
        
      </Popup>
    </>
  );
}

const InvitationsPdf = ({ selectedNetwork, qrCodes }) => {

  const invitations = qrCodes.map((qrCode) => {
    console.log(qrCode)
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
      alignItems: 'baseline',
      gap: '10px',
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
    networkLogo: {
      maxHeight: '25px',
      maxWidth: '25px',
    },
    networkHeader: {
      backgroundColor: selectedNetwork.backgroundColor,
    },
    invitationCard: {
      maxWidth: '50%',
      maxHeight: '40%',
    }
  });

  return (
    <>
      <View style={styles.networkHeader}>
        <Image
          style={styles.networkLogo}
          src={makeImageUrl(selectedNetwork.image)}
        />
        <Text>{selectedNetwork.name}</Text>
        <Text>{t('invitation.card')}</Text>
      </View>
      <View style={styles.invitationCard}>
        <Text>{qrCode}</Text>
        <Text>{t('invitation.infoCard')}</Text>
        <Text>{t('invitation.name')}</Text>
        <Text>{t('invitation.contact')}</Text>
        <Text>{t('invitation.infoQr')}</Text>

        <Image src={qrCodeImage} />
        <Text>{qrCode}</Text>
      </View>
    </>
  );
};
