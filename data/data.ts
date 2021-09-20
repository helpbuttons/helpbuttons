const data = [
    {
        //required data
        name: "Perritos en adopcion",
        url: "net/url",
        avatar: "image/url.png",
        privacy: "publico", //enum {publico, privado} default publico
        roles: "admin", //enum {admin, user, blocked} default admin, user
        //not required data
        tags: ["Animales", "Perritos", "Adopcion"],
        description: "Net for animal rescue",
        buttonsTemplate: [{id:1,name:"repartidor",type:"offer",, fields:[geoCode:"posicion boton", , ]},{id:2,name:"restaurante",type:"need",, fields:[geoCode:"posicion boton", , ]}], //array of objects, each type has an int, a name and a color associated. Default are offer (green), need (red).
        //data for GIS
        showButtons : "area", //enum {area, point} show buttons by area not showing exact position on map
        location: "Livorno, Italia",
        latitude: 43.33,
        longitude: 43.33,
        radius: 240,
        //only for admins:
        networkRoles: [], //array of roles specific for the net, default are net admins. Each of these net roles have their user list
        blockedUsers: [11,223,133], //user ids, the blocked users cannot rejoin a network. only admin users
        // extra option friendNets:[12,234],

        buttons: [
            {   //required data
                templateId: 1,
                active: true,
                tags: ["tag1", "tag2", "tag3"],
                //required data
                date: ["1/08/2021"],
                //GIS DATA
                location: ["Livorno, Italia"],
                longitude: [43.2333],
                latitude: [21.0002],
                // optional values
                networks: [13,24],
                chatType: "single", //enum {single,group} chat structure
                templateExtraData: {}, //JSON template contains info about the image and the description (standard) and also about booleans, radius, checklist and every other field related to the network module
            },
        ]
    },
];

export default fakeData;
