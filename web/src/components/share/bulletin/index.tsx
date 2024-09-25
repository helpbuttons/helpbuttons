import t from 'i18n';
import { useEffect, useState } from 'react';
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import { Button } from 'shared/entities/button.entity';
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
  UpdateFilters,
} from 'state/Explore';
import Btn, { IconType } from 'elements/Btn';
import { IoSearch } from 'react-icons/io5';
import { FindBulletinButtons } from 'state/Button';
import {
  applyFilters,
  defaultDaysForBulletin,
} from 'components/search/AdvancedFilters/filters.type';
import { readableDate, readableTime } from 'shared/date.utils';
import { advancedSearchText } from 'elements/HeaderSearch';
import { orderBy } from 'pages/Explore/HoneyComb';
import { Network } from 'shared/entities/network.entity';
import Loading from 'components/loading';
import { FilterByDays } from 'components/search/AdvancedFilters/filter-by-days';
import Popup from 'components/popup/Popup';
import { PdfIframe, usePdfGenerateBlob } from '../pdf';

export default function ShareBulletinForm() {
  const [bulletinButtons, setBulletinButtons] = useState(null);
  const [fetchedButtons, setFetchedButtons] = useState(null);
  const [days, setDays] = useState(defaultDaysForBulletin);
  const [dateTime, setDateTime] = useState(null);
  const buttonTypes = useButtonTypes();
  const [isLoading, setIsLoading] = useState(true);
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
    if (filters && filters.days) {
      if (filters.days !== days) {
        setIsLoading(() => true);
        // setPdfBlobUrl(() => null);
        setDays(() => filters.days);
      } else if (fetchedButtons) {
        setIsLoading(() => true);
        // setPdfBlobUrl(() => null);
        applyFiltersToBulletin(fetchedButtons);
      }
    }
  }, [filters]);

  useEffect(() => {
    if (bulletinButtons) {
      generatePdf()
      .then(() => {
        setIsLoading(() => false);
      });
    }
    setFilterButtonCaption(() => {
      return (
        <>
          {t('bulletin.found', [
            bulletinButtons?.length.toString(),
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
  }, [bulletinButtons]);
  const applyFiltersToBulletin = (buttons) => {
    setFetchedButtons(() => buttons);
    setBulletinButtons(() => {
      const { filteredButtons } = applyFilters(
        filters,
        buttons,
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
      return orderedFilteredButtons.map((btn) => {
        return {
          ...btn,
          qrcode: QRCode.toDataURL(
            getShareLink(`/ButtonFile/${btn.id}`),
          ),
        };
      });
    });
  };

  useEffect(() => {
    const onButtonsFetched = (fetchedButtons) => {
      applyFiltersToBulletin(fetchedButtons);
      
    };
    if (buttonTypes.length > 0 && filters?.days) {
      store.emit(
        new FindBulletinButtons(0, 200, filters.days, (buttons) => {
          onButtonsFetched(buttons);
        }),
      );
    }

    if (filters?.days) {
      setDateTime(() => {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - filters.days);
        return daysAgo;
      });
    }

  }, [filters?.days, buttonTypes]);

  const [filterButtonCaption, setFilterButtonCaption] = useState(
    t('bulletin.filter', [days.toString()]),
  );

  const updateDays = (days) => {
    store.emit(new UpdateFilters({ ...filters, days }));
  };

  const [pdfBlobUrl, generatePdf] = usePdfGenerateBlob(
    <BulletinPDF
      buttons={bulletinButtons}
      buttonTypes={buttonTypes}
      selectedNetwork={selectedNetwork}
      dateTime={dateTime}
    />,
  );

  return (
    <>
      <Popup>
        {t('bulletin.explainBulletin')}
        <Btn
          onClick={() => store.emit(new ToggleAdvancedFilters())}
          iconLeft={IconType.svg}
          iconLink={<IoSearch />}
          caption={filterButtonCaption}
        />
        <div>
          <FilterByDays days={days} setDays={setDays} />
          <Btn
            onClick={() => {
              updateDays(days);
            }}
            caption={
              <>
              {isLoading && <Loading/>}
              {!isLoading &&  t('bulletin.changeDays')}
              </>
              //
            }
          />

          {}
          <PdfIframe
              blob={pdfBlobUrl}
            />
          {!(bulletinButtons?.length > 0) && (
            <>{t('bulletin.noButtons')}</>
          )}
        </div>
      </Popup>

      <AdvancedFilters
        showFilterByDays={true}
        target="/Bulettin"
        isHome={false}
      />
    </>
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
    header: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'baseline',
      gap: '10px',
    },
    networkLogo: {
      maxHeight: '25px',
      maxWidth: '25px',
    },
    networkName: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '25px',
    },
    date: {
      fontWeight: 'thin',
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            style={styles.networkLogo}
            src={makeImageUrl(selectedNetwork.image)}
          />
          <Text style={styles.networkName}>
            {selectedNetwork.name}
          </Text>
          <Text style={styles.date}>
            {t('bulletin.pdfDate', [readableDate(dateTime)])}
          </Text>
        </View>
        <View>
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
      alignItems: 'flex-start',
      maxHeight: 300,
      maxWidth: '100vw',
      fontStyle: 'bold',
    },
    tableContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      maxWidth: '100%',
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
      maxWidth: 'auto',
      maxHeight: 'auto',
    },
    button_type: {
      width: 'auto',
      color: rowColor,
      fontWeight: 'bold',
    },
    title: {
      display: 'flex',
      flexDirection: 'row',
      fontWeight: 'bold',
    },
    row: {
      width: 'auto',
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      gap: '5px',
    },
    description: {
      fontSize: 12,
      display: 'flex',
      flexDirection: 'column',
    },
    place: {
      fontSize: 12,
    },
    qrcode: {
      margin: 'auto',
    },
    date: {
      fontSize: 12,
    },
  });
  return (
    <>
      {buttonType && (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            gap: '10px',
            marginBottom: '15px',
          }}
        >
          <View style={{ width: '20%' }}>
            <Image
              style={styles.image}
              src={makeImageUrl(button.image)}
            />
          </View>
          <Text style={styles.button_type}>{buttonType.caption}</Text>
          <View style={styles.row}>
            <Text style={styles.title}>{button.title} </Text>
            <Text style={styles.place}> {button.address}</Text>
            <Text style={styles.date}>
              {readableDate(button.created_at)} -{' '}
              {readableTime(button.created_at)}
            </Text>
          </View>
          <Image style={styles.qrcode} src={button.qrcode} />
        </View>
      )}
    </>
  );
};
