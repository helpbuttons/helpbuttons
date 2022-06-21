export interface IButton {
  id?: any | null;
  owner?: any;
  name: string;
  images: any[];
  templateButtonId?: any | null;
  type?: enum;
  tags?: any[];
  description: string;
  //required data
  date?: [];
  //GIS DATA
  // geoPlace: [],
  latitude: number;
  longitude: number;
  // optional values
  networks?: [];
  feedType?: enum; //enum {single,group} feed structure
  templateExtraData?: {}; //JSON template contains info about the image and the description (standard) and also about booleans, radius, checklist and every other field related to the network module
}
