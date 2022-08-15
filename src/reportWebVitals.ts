import {ReportHandler, getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

const reportWebVitals = (onPerfEntry: ReportHandler) => {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
};

export default reportWebVitals;
