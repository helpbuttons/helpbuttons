
import HoneyComb from './HoneyComb';
import NavBottom from 'components/nav/NavBottom';

export default function Explore() {
  
  // temporary hack to avoid deep refactor
  // store.emit(new setNetwork(selectedNetwork));
  return (
    <>
      {/* <SEO {...metadata}/> */}
      <HoneyComb />
      <NavBottom />
    </>
  );
}

// export const getServerSideProps = async (ctx: NextPageContext) => {
//   const serverProps = await ServerPropsService.general('Explore', ctx)
//   return {props: serverProps}
// }
