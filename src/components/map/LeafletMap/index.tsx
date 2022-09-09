//leaflet component for map manage
import dynamic from 'next/dynamic';

const LeafLetMap = dynamic(() => import('./LeafLetMap'), {
  ssr: false
});

export default LeafLetMap;
