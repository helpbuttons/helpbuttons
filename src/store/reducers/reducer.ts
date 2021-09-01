interface ActionType {
    type: string,
    payload: string;
}

const initialState = [
    {
        netName: "Perritos en adopcion",
        netLocation: "Livorno, Italia",
        netTags: ["Animales", "Perritos", "Adopcion"],
        netButtons: [
            {
                type: "Perritos en adopcion",
                tags: ["tag1", "tag2", "tag3"],
                date: "1/08/2021",
                location: "Livorno, Italia",
                coordinates: "43.33.07"
            },
            {
                type: "Perritos en adopcion",
                tags: ["tag1", "tag2", "tag3"],
                date: "1/08/2021",
                location: "Pisa, Italia",
                coordinates: "43.33.07"
            },
            {
                type: "Perritos en adopcion",
                tags: ["tag1", "tag2", "tag3"],
                date: "1/08/2021",
                location: "Roma, Italia",
                coordinates: "43.33.07"
            },
            {
                type: "Perritos en adopcion",
                tags: ["tag1", "tag2", "tag3"],
                date: "1/08/2021",
                location: "Firenze, Italia",
                coordinates: "43.33.07"
            },
        ]
    },
    {
        netName: "Comida para todos",
        netLocation: "Madrid, España",
        netTags: ["Comida", "Ayudemos", "Comunidad"],
        netButtons: [
            {
                type: "Comida para todos",
                tags: ["tag1", "tag2", "tag3"],
                date: "10/08/2021",
                location: "Madrid, España",
                coordinates: "40.416775"
            },
            {
                type: "Comida para todos",
                tags: ["tag1", "tag2", "tag3"],
                date: "1/08/2021",
                location: "Barcelona, Italia",
                coordinates: "43.33.07"
            },
            {
                type: "Comida para todos",
                tags: ["tag1", "tag2", "tag3"],
                date: "1/08/2021",
                location: "Sevilla, Italia",
                coordinates: "43.33.07"
            },
            {
                type: "Comida para todos",
                tags: ["tag1", "tag2", "tag3"],
                date: "1/08/2021",
                location: "Firenze, Italia",
                coordinates: "43.33.07"
            },
        ]
    }
];

const reducer = (state = initialState, action: ActionType) => {
    switch (action.type) {
        case "FILTER_NETWORKS":
            const previousState = [...initialState];
            if (action.payload === "all") {
                return previousState;
            } else {
                return previousState.filter(net => net.netName === action.payload)
            }
        default: return state
    }
}

export default reducer;