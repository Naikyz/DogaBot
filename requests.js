const axios = require("axios");

async function axiosRequest(_query) {
    const response = await axios({
        url: 'https://data.objkt.com/v2/graphql',
        method: 'post',
        data: {
            query: _query
        }
    })
    return (response);
}

async function getFloorPrice() {
    const query = `
        query {
            fa(where: {path: {_eq: "dogami"}}) {
                floor_price
            }
        }`
    const response = await axiosRequest(query)
    return (response.data.data.fa[0].floor_price.toString());
}

async function getBoxFloor() {
    const query = `
        query {
            token(where: {fa: {live: {_eq: true}}, supply: {_gt: "0"}, flag: {_neq: "removed"}, artifact_uri: {_is_null: false}, timestamp: {_is_null: false}, fa_contract: {_eq: "KT1NVvPsNDChrLRH5K2cy6Sc9r1uuUwdiZQd"}, mime: {_in: ["video/mp4", "video/webm", "video/quicktime", "video/ogg"]}}, order_by: {lowest_ask: asc_nulls_last, token_id: asc}, limit: 1) {
                token_id
                lowest_ask
            }
        }`
    const response = await axiosRequest(query)
    return (response.data.data.token[0].lowest_ask / 1000000);
}

async function getDogFloor() {
    const query = `
        query {
            token(where: {fa: {live: {_eq: true}}, supply: {_gt: "0"}, flag: {_neq: "removed"}, artifact_uri: {_is_null: false}, timestamp: {_is_null: false}, fa_contract: {_eq: "KT1NVvPsNDChrLRH5K2cy6Sc9r1uuUwdiZQd"}, mime: {_in: ["model/gltf-binary", "model/gltf+json"]}}, order_by: {lowest_ask: asc_nulls_last, token_id: asc}, limit: 1) {
                token_id
                lowest_ask
            }
        }`
    const response = await axiosRequest(query)
    return (response.data.data.token[0].lowest_ask / 1000000);
}

async function getVolume(date) {
    const query = `
        query MyQuery {
            event(order_by: {timestamp: desc, id: desc}, where: {timestamp: {_is_null: false, _gte: "` + date + `"}, event_type: {_in: ["ask_purchase", "dutch_purchase", "accept_offer", "conclude_auction"]}, fa_contract: {_eq: "KT1NVvPsNDChrLRH5K2cy6Sc9r1uuUwdiZQd"}, price: {_is_null: false}}) {
            amount
            price
            token_pk
            }
        }`
    const response = await axiosRequest(query)
    return (response.data.data.event);
}

async function getTodaysVolume() {
	let date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
	data = await getVolume(date)
	return data.length
}

module.exports = {getFloorPrice, getBoxFloor, getDogFloor, getVolume, getTodaysVolume}