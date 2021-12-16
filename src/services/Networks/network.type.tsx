export interface INetwork {
  //required data
  id: string;
  name: string,
  url: string,
  avatar: string,
  privacy: string, //enum {publico, privado} default publico
  roles: string, //enum {admin, user, blocked} default admin, user
  //not required data
  tags: [],
  description: string,
  buttonsTemplate: {}, //array of objects, each type has an int, a name and a color associated. Default are offer (green), need (red).
  //data for GIS
  showButtons : string, //enum {area, point} show buttons by area not showing exact position on map
  place: string,
  geoPlace: {},
  radius: string,
  friendNetworks: [],
  //only for admins:
  networkRoles: [], //array of roles specific for the net, default are net admins. Each of these net roles have their user list
  blockedUsers: [], //user ids, the blocked users cannot rejoin a network. only admin users
  // extra option friendNets:[12,234],}
}
