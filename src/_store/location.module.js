import {RegionService} from '@/_services/region.service';
const regionService = new RegionService();

const storeRegions = JSON.parse(window.localStorage.getItem('regions'));

const state = {
    regions: storeRegions ? storeRegions.content : []
};

const actions = {
    fetchRegions({commit}) {
        regionService.list().then((res) => {
            commit('SET_REGIONS', res.content);
            window.localStorage.setItem('regions', JSON.stringify(res));
        }).catch(err => console.log(err));
    },
};

const mutations = {
    SET_REGIONS(state, resp) {
        state.regions = resp;
    }
};

export const location = {
    namespaced: true,
    state,
    actions,
    mutations
};
