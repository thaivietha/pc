import Cookies from 'js-cookie'
export default function ({  store }, inject) {
  const token = Cookies.get('token')
  token && store.commit('setToken', token)
  store.dispatch('getCategory')
  store.dispatch('getPublicData')
  const getImageUri = (url = '') => {
    const oss_domain = store.getters.ossDomain || ''
    return oss_domain + url
  }
  inject("getImageUri", getImageUri);
}