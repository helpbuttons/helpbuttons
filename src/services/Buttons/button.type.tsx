export default interface ButtonData {
  id?: any | null,
  templateId: any | null,
  tags: ["tag1", "tag2", "tag3"],
  //required data
  date: [],
  //GIS DATA
  location: [],
  longitude: [],
  latitude: [],
  // optional values
  networks: [],
  feedType: "single", //enum {single,group} feed structure
  templateExtraData: {}, //JSON template contains info about the image and the description (standard) and also about booleans, radius, checklist and every other field related to the network module
}
