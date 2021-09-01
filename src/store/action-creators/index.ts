export const filterNetworks = (string) => {
    return (dispatch: any) => {
        dispatch({
            type: "FILTER_NETWORKS",
            payload: string
        })
    }
}