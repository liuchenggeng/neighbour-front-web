import SingleUpload from './singleUpload'
import MultiUpload from './multiUpload'


function fileUploadFn(Vue) {
    Vue.component("single-upload", SingleUpload)
    Vue.component("multi-upload", MultiUpload)
}

export default fileUploadFn