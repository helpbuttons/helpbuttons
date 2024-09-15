import t from 'i18n';
import { useEffect, useState } from 'react';
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import { Button } from 'shared/entities/button.entity';
import { PDFViewer } from '@react-pdf/renderer';
import QRCode from 'qrcode';

import React from 'react';
import {
  Document,
  Page,
  Image,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { getShareLink, makeImageUrl } from 'shared/sys.helper';
import { useButtonTypes } from 'shared/buttonTypes';
import AdvancedFilters from 'components/search/AdvancedFilters';
import {
  ToggleAdvancedFilters,
  UpdateBoundsFilteredButtons,
} from 'state/Explore';
import Btn, { IconType } from 'elements/Btn';
import { IoSearch } from 'react-icons/io5';
import { FindBulletinButtons } from 'state/Button';
import { applyFilters } from 'components/search/AdvancedFilters/filters.type';
import {
  readableDate,
  readableDateTime,
  readableTime,
} from 'shared/date.utils';
import { advancedSearchText } from 'elements/HeaderSearch';
import { orderBy } from 'pages/Explore/HoneyComb';
import { Network } from 'shared/entities/network.entity';

export default function Bulletin() {
  const [bulletinButtons, setBulletinButtons] = useState([]);
  const [days, setDays] = useState(10);
  const [dateTime, setDateTime] = useState(null);
  const buttonTypes = useButtonTypes();
  const [fetchedButtons, setFetchedButtons] = useState([]);

  const filters = useStore(
    store,
    (state: GlobalState) => state.explore.map.filters,
  );
  const selectedNetwork: Network = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
    true,
  );

  useEffect(() => {
    if (filters && selectedNetwork) {
      setBulletinButtons(() => {
        const { filteredButtons } = applyFilters(
          filters,
          fetchedButtons,
          buttonTypes,
        );

        const orderedFilteredButtons = orderBy(
          filteredButtons,
          filters.orderBy,
          selectedNetwork?.exploreSettings?.center,
        );

        store.emit(
          new UpdateBoundsFilteredButtons(orderedFilteredButtons),
        );
        return filteredButtons.map((btn) => {
          return {
            ...btn,
            qrcode: QRCode.toDataURL(
              getShareLink(`/ButtonFile/${btn.id}`),
            ),
          };
        });
      });
    }
  }, [fetchedButtons, filters]);

  useEffect(() => {
    if (filters && filters.days) {
      if (filters.days !== days) {
        setDays(() => filters.days);
      }
    }
  }, [filters]);

  useEffect(() => {
    setDateTime(() => {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return daysAgo;
    });
    setFilterButtonCaption(() => {
      return (
        <>
          {t('bulletin.found', [
            bulletinButtons.length.toString(),
            readableDate(dateTime),
          ])}
          <br />
          {filters && (
            <>
              {advancedSearchText(
                filters.query,
                buttonTypes,
                [],
                filters,
                selectedNetwork.currency,
              )}
            </>
          )}
        </>
      );
    });
  }, [filters, bulletinButtons, dateTime])
  useEffect(() => {
    if (buttonTypes.length > 0) {
      store.emit(
        new FindBulletinButtons(0, 100, days, (buttons) =>
          setFetchedButtons(() => buttons),
        ),
      );
    } else {
      console.log('button types is null...AAAGRH');
    }
  }, [days, buttonTypes]);

  const [filterButtonCaption, setFilterButtonCaption] = useState(
    t('bulletin.filter', [days.toString()]),
  );
  return (
    <div>
      {t('bulletin.explainBulletin')}
      <Btn
        onClick={() => store.emit(new ToggleAdvancedFilters())}
        iconLeft={IconType.svg}
        iconLink={<IoSearch />}
        caption={filterButtonCaption}
      />
      <div>
        <AdvancedFilters showFilterByDays={true} target="/Bulettin" />
        {selectedNetwork && (
          <PDFViewer style={{ width: '100%', height: '500px' }}>
            <BulletinPDF
              buttons={bulletinButtons}
              buttonTypes={buttonTypes}
              selectedNetwork={selectedNetwork}
              dateTime={dateTime}
            />
          </PDFViewer>
        )}
      </div>
    </div>
  );
}

const BulletinPDF = ({
  buttons,
  buttonTypes,
  selectedNetwork,
  dateTime,
}) => {
  const styles = StyleSheet.create({
    page: {
      padding: 20,
    },
    section: {
      textAlign: 'center',
    },
    networkLogo: {
      maxHeight: '25px',
    },
    networkName: {
      textAlign: 'center',
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainHeader}>
          <Image
            style={styles.networkLogo}
            src={makeImageUrl(selectedNetwork.image)}
          />
          <Text style={styles.networkName}>
            {t('bulletin.pdfNetworkTitle', [
              selectedNetwork.name,
              readableDate(dateTime),
            ])}
          </Text>
          <ButtonRows buttons={buttons} buttonTypes={buttonTypes} />
        </View>
      </Page>
    </Document>
  );
};
const ButtonRows = ({ buttons, buttonTypes }) => {
  const borderColor = '#3778C2';

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      borderTopColor: '#3778C2',
      borderTopWidth: 3,
      alignItems: 'center',
      height: 100,
      fontStyle: 'bold',
    },
    tableContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 24,
    },

    container: {
      flexDirection: 'row',
      color: '#fff',
      borderBottomWidth: 1,
      alignItems: 'center',
      height: 24,
      textAlign: 'center',
      fontStyle: 'bold',
      flexGrow: 1,
    },
  });
  const rows = buttons.map((button: Button) => (
    <View
      style={{
        ...styles.row,
        borderTopColor: buttonTypes.find(
          (_buttonType) => _buttonType.name == button.type,
        ).cssColor,
      }}
      key={button.id}
    >
      <ButtonRow
        button={button}
        buttonType={buttonTypes.find(
          (_buttonType) => _buttonType.name == button.type,
        )}
      />
    </View>
  ));
  return (
    <>
      <View style={styles.tableContainer}>{rows}</View>
    </>
  );
};

const ButtonRow = ({ button, buttonType }) => {
  const rowColor = buttonType.cssColor;
  const styles = StyleSheet.create({
    image: {
      width: '20%',
    },
    button_type: {
      width: '15%',
      padding: 10,
      color: rowColor,
      fontWeight: 'bold',
    },
    title: {
      display: 'flex',
      flexDirection: 'row',
    },
    row: {
      width: '45%',
      display: 'flex',
      flexDirection: 'column',
    },
    description: {
      fontSize: 12,
      display: 'flex',
      flexDirection: 'column',
    },
    place: {
      fontSize: 8,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    qrcode: {
      width: '20%',
    },
    date: {
      fontSize: 10,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
    },
  });
  return (
    <>
      {buttonType && (
        <>
          <Image
            style={styles.image}
            src={makeImageUrl(button.image)}
          />
          <Text style={styles.button_type}>{buttonType.caption}</Text>
          <Text style={styles.row}>
            <Text style={styles.title}>{button.title} </Text>
            <Text style={styles.place}> {button.address}</Text>
            <Text style={styles.date}>
              {readableDate(button.created_at)} -{' '}
              {readableTime(button.created_at)}
            </Text>
          </Text>
          <Image style={styles.qrcode} src={button.qrcode} />
        </>
      )}
    </>
  );
};
