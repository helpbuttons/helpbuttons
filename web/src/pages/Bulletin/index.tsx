import t from 'i18n';
import { useEffect, useState } from 'react';
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import { Button } from 'shared/entities/button.entity';
import { pdf } from '@react-pdf/renderer';
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

export default function Bulletin() {
  const [bulletinButtons, setBulletinButtons] = useState(null);
  const [fetchedButtons, setFetchedButtons] = useState(null);
  const [days, setDays] = useState(defaultDaysForBulletin);
  const [dateTime, setDateTime] = useState(null);
  const buttonTypes = useButtonTypes();
  const [isLoading, setIsLoading] = useState(true);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
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
        setPdfBlobUrl(() => null);
        setDays(() => filters.days);
      }else if(fetchedButtons){
        
        setIsLoading(() => true);
        setPdfBlobUrl(() => null);
        applyFiltersToBulletin(fetchedButtons)
      }
      
    }
  }, [filters]);
  
  useEffect(() => {
    if (bulletinButtons) {
      pdf(
        <BulletinPDF
          buttons={bulletinButtons}
          buttonTypes={buttonTypes}
          selectedNetwork={selectedNetwork}
          dateTime={dateTime}
        />,
      )
        .toBlob()
        .then((blob) =>
          setPdfBlobUrl(() => {
            return URL.createObjectURL(blob);
          }),
        );
        
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
    setFetchedButtons(() => buttons)
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
  }

  useEffect(() => {
    const onButtonsFetched = (fetchedButtons) => {
      applyFiltersToBulletin(fetchedButtons)
      setIsLoading(() => false);
    }
    if (buttonTypes.length > 0 && filters?.days) {
      store.emit(
        new FindBulletinButtons(0, 200, filters.days, (buttons) => {
          onButtonsFetched(buttons);
        }),
      );
    }

    if( filters?.days)
    {
      setDateTime(() => {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - filters.days);
        return daysAgo;
      });
    }
    

    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [filters?.days, buttonTypes]);

  const [filterButtonCaption, setFilterButtonCaption] = useState(
    t('bulletin.filter', [days.toString()]),
  );

  const updateDays = (days) => {
    store.emit(new UpdateFilters({ ...filters, days }));
  };
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
        <FilterByDays days={days} setDays={setDays} />
        <Btn
          onClick={() => {
            updateDays(days);
          }}
          caption={t('bulletin.changeDays')}
        />
        <AdvancedFilters
          showFilterByDays={true}
          target="/Bulettin"
          isHome={false}
        />
        {(isLoading || !pdfBlobUrl) && <Loading></Loading>}
        {(pdfBlobUrl && bulletinButtons?.length > 0) && (
          <iframe
            src={pdfBlobUrl}
            title="Generated PDF"
            width="80%"
            height="600px"
            style={{ border: '1px solid #ccc' }}
          />          
        )}
        {!(bulletinButtons?.length > 0) && (
          <>{t('bulletin.noButtons')}</>
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
        <View>
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
