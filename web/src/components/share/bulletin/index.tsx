import t from 'i18n';
import { useEffect, useState } from 'react';
import { useStore } from 'state';
import { GlobalState, store } from 'state';
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
  const [pdfBlobUrl, setPdfBlobUrl, generatePdf] = usePdfGenerateBlob(
    <BulletinPDF
      buttons={bulletinButtons}
      buttonTypes={buttonTypes}
      selectedNetwork={selectedNetwork}
      dateTime={dateTime}
    />,
  );

  useEffect(() => {
    if (filters && filters.days) {
      if (filters.days !== days) {
        setIsLoading(() => true);
        setPdfBlobUrl(() => null);
        setDays(() => filters.days);
      } else if (fetchedButtons) {
        setIsLoading(() => true);
        setPdfBlobUrl(() => null);
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
              {/* <AdvancedFiltersQueryString
                  query={query}
                  selectedButtonTypes={filters.helpButtonTypes}
                  tags={tags}
                  filters={filters}
                  currency={selectedNetwork.currency}
              /> */}
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

  

  return (
    <>
        {t('bulletin.explainBulletin')}
        <div>
          <FilterByDays days={days} setDays={(days) => {setDays(days);  updateDays(days);}} />
          <PdfIframe
              blob={pdfBlobUrl}
            />
          {!(bulletinButtons?.length > 0) && (
            <>{t('bulletin.noButtons')}</>
          )}
        </div>
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
      height:'100%',
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
    buttonDiv: {
      height: 'auto',
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
        <View style={styles.buttonDiv}>
          <ButtonRows buttons={buttons} buttonTypes={buttonTypes} />
        </View>
      </Page>
    </Document>
  );
};

const ButtonRows = ({ buttons, buttonTypes }) => {
  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      borderTopColor: '#3778C2',
      borderTopWidth: 3,
      alignItems: 'center',
      paddingVertical: 10,
      width: '100%',
      maxWidth: '100%',
      fontStyle: 'bold',
    },
    tableContainer: {
      flexDirection: 'column',
      width: '100%',
      height: 'auto',
      marginTop: 24,
    },
  });

  const rows = buttons.map((button) => {
    const buttonType = buttonTypes.find(
      (type) => type.name === button.type,
    );

    return (
      <View
        style={{
          ...styles.row,
          borderTopColor: buttonType?.cssColor || '#3778C2',
        }}
        key={button.id}
      >
        <ButtonRow button={button} buttonType={buttonType} />
      </View>
    );
  });

  return <View style={styles.tableContainer}>{rows}</View>;
};

// const ButtonRows = ({ buttons, buttonTypes }) => {
//   const borderColor = '#3778C2';

//   const styles = StyleSheet.create({
//     row: {
//       flexDirection: 'row',
//       borderTopColor: '#3778C2',
//       borderTopWidth: 3,
//       boxsizing: 'border-box',
//       alignItems: 'flex-start',
//       backgroundColor:'green',
//       height: '200px',
//       width: '100%',
//       maxWidth: '100%',
//       fontStyle: 'bold',
//     },
//     tableContainer: {
//       flexDirection: 'column',
//       flexWrap: 'nowrap',
//       maxWidth: '100%',
//       height: '100%',
//       backgroundColor:'yellow',
//       marginTop: 24,
//     },

//     container: {
//       flexDirection: 'row',
//       color: '#fff',
//       borderBottomWidth: 1,
//       alignItems: 'center',
//       height: '200px',
//       marginBottom: 10,
//       textAlign: 'center',
//       fontStyle: 'bold',
//       flexGrow: 1,
//     },
//   });
//   const rows = buttons.map((button: Button) => (
//     <View
//       style={{
//         ...styles.row,
//         borderTopColor: buttonTypes.find(
//           (_buttonType) => _buttonType.name == button.type,
//         ).cssColor,
//       }}
//       key={button.id}
//     >
//       <ButtonRow
//         button={button}
//         buttonType={buttonTypes.find(
//           (_buttonType) => _buttonType.name == button.type,
//         )}
//       />
//     </View>
//   ));
//   return (
//     <>
//       <View style={styles.tableContainer}>{rows}</View>
//     </>
//   );
// };
const ButtonRow = ({ button, buttonType }) => {
  const rowColor = buttonType.cssColor;
  const styles = StyleSheet.create({
    image: {
      width: '80px',
      height: '80px',
    },
    imageWrapper: {
      width: '80px',
      height: '80px',
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: '10px',
    },
    button_type: {
      color: rowColor,
      fontWeight: 'bold',
      fontSize: 10,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 4,
      textOverflow: 'ellipsis',
      display: 'flex',
      flexWrap: 'nowrap',
    },
    row: {
      flexDirection: 'column',
      justifyContent: 'center',
      textOverflow: 'ellipsis',
      maxWidth: '300px',
      overflow: 'hidden',
      overflowWrap: 'nowrap',
      flexGrow: 1,  // Ensures this section takes up available space
      flexBasis: 'auto',
      paddingRight: '10px',
      maxHeight: '75px',
    },
    description: {
      fontSize: 12,
      color: 'gray',
    },
    place: {
      fontSize: 12,
      marginTop: 4,
    },
    qrcode: {
      width: '80px',
      height: '80px',
      marginLeft: '10px',
    },
    date: {
      fontSize: 12,
      marginTop: 4,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',  // Spreads elements evenly
      borderBottomColor: '#3778C2',
      borderBottomWidth: 1,
      paddingVertical: 2,
      paddingHorizontal: '10px',
      width: '100%',  // Ensures container takes up full width
      flexWrap: 'nowrap',  // Prevents wrapping
    },
  });

  return (
    <>
      {buttonType && (
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            <Image style={styles.image} src={makeImageUrl(button.image)} />
          </View>
          <View style={styles.row}>
            <Text style={styles.button_type}>{buttonType.caption}</Text>
            <Text style={styles.title}>{button.title}</Text>
            <Text style={styles.place}>{button.address}</Text>
            <Text style={styles.date}>
              {readableDate(button.created_at)} - {readableTime(button.created_at)}
            </Text>
          </View>
          <Image style={styles.qrcode} src={button.qrcode} />
        </View>
      )}
    </>
  );
};



// const ButtonRow = ({ button, buttonType }) => {
//   const rowColor = buttonType.cssColor;
//   const styles = StyleSheet.create({
//     image: {

//       position:'relative',
//       height: '100%',
      
//     },
//     imageWrapper: {
//       width: '80px',
//       height: '80px',
//       overflow: 'hidden',
//       display: 'flex',
//       justifyContent: 'center',
//       alignContent:'center',
//       position:'relative',
//     },
//     button_type: {
//       width: 'auto',
//       color: rowColor,
//       fontWeight: 'bold',
//     },
//     title: {
//       display: 'flex',
//       flexDirection: 'row',
//       fontWeight: 'bold',
//     },
//     row: {
//       width: 'auto',
//       display: 'flex',
//       justifyContent: 'flex-start',
//       flexDirection: 'column',
//       backgroundColor: rowColor,
//       gap: '5px',
//     },
//     description: {
//       fontSize: 12,
//       display: 'flex',
//       flexDirection: 'column',
//     },
//     place: {
//       fontSize: 12,
//     },
//     qrcode: {
//       margin: 'auto',
//     },
//     date: {
//       fontSize: 12,
//     },
//   });
//   return (
//     <>
//       {buttonType && (
//         <View
//           style={{
//             width: '100%',
//             flexDirection: 'row',
//             gap: '10px',
//             maxHeight: '200px',
//               height: '200px',
//               overflow: 'hidden',
//             marginBottom: '15px',
//           }}
//         >
//           <View style={styles.imageWrappper}>
//             <Image
//               style={styles.image}
//               src={makeImageUrl(button.image)}
//             />
//           </View>
//           <Text style={styles.button_type}>{buttonType.caption}</Text>
//           <View style={styles.row}>
//             <Text style={styles.title}>{button.title} </Text>
//             <Text style={styles.place}> {button.address}</Text>
//             <Text style={styles.date}>
//               {readableDate(button.created_at)} -{' '}
//               {readableTime(button.created_at)}
//             </Text>
//           </View>
//           <Image style={styles.qrcode} src={button.qrcode} />
//         </View>
//       )}
//     </>
//   );
// };
