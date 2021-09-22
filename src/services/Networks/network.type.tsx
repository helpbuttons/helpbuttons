export interface NetworkData {
  //required data
  name: string,
  url: string,
  avatar: string,
  privacy: enum, //enum {publico, privado} default publico
  roles: enum, //enum {admin, user, blocked} default admin, user
  //not required data
  tags: [],
  description: string,
  buttonsTemplate: {}, //array of objects, each type has an int, a name and a color associated. Default are offer (green), need (red).
  //data for GIS
  showButtons : enum, //enum {area, point} show buttons by area not showing exact position on map
  location: string,
  latitude: float,
  longitude: float,
  radius: int,
  //only for admins:
  networkRoles: [], //array of roles specific for the net, default are net admins. Each of these net roles have their user list
  blockedUsers: [], //user ids, the blocked users cannot rejoin a network. only admin users
  // extra option friendNets:[12,234],}
}
