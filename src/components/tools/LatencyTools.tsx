import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';
import { CustomSelect, SelectOption } from '../CustomSelect';

interface TestTarget {
    id: string;
    provider: string;
    region: string;
    country: string;
    continent: 'Asia' | 'Americas' | 'Europe' | 'MEA' | 'Oceania';
    countryCode: string; // ISO 3166-1 alpha-2 for flagcdn
    url: string;
}

interface TestResult {
    latency: number | null; // null for timeout/error
    status: 'pending' | 'testing' | 'done' | 'error';
}

const TIMEOUT_MS = 3000;
const BATCH_SIZE = 10;

// Example endpoints - In a real scenario, these should be reliable public endpoints
const targets: TestTarget[] = [
    // GCP (gcping.com endpoints)
    // Asia Pacific
    { id: 'gcp-asia-east1', provider: 'GCP', region: 'tool.latency.regions.taiwan', country: 'Taiwan', continent: 'Asia', countryCode: 'cn', url: 'https://asia-east1-5tkroniexa-de.a.run.app/api/ping' },
    { id: 'gcp-asia-east2', provider: 'GCP', region: 'tool.latency.regions.hong_kong', country: 'Hong Kong', continent: 'Asia', countryCode: 'hk', url: 'https://asia-east2-5tkroniexa-df.a.run.app/api/ping' },
    { id: 'gcp-asia-northeast1', provider: 'GCP', region: 'tool.latency.regions.tokyo', country: 'Japan', continent: 'Asia', countryCode: 'jp', url: 'https://asia-northeast1-5tkroniexa-an.a.run.app/api/ping' },
    { id: 'gcp-asia-northeast2', provider: 'GCP', region: 'tool.latency.regions.osaka', country: 'Japan', continent: 'Asia', countryCode: 'jp', url: 'https://asia-northeast2-5tkroniexa-dt.a.run.app/api/ping' },
    { id: 'gcp-asia-northeast3', provider: 'GCP', region: 'tool.latency.regions.seoul', country: 'South Korea', continent: 'Asia', countryCode: 'kr', url: 'https://asia-northeast3-5tkroniexa-du.a.run.app/api/ping' },
    { id: 'gcp-asia-south1', provider: 'GCP', region: 'tool.latency.regions.mumbai', country: 'India', continent: 'Asia', countryCode: 'in', url: 'https://asia-south1-5tkroniexa-el.a.run.app/api/ping' },
    { id: 'gcp-asia-south2', provider: 'GCP', region: 'tool.latency.regions.delhi', country: 'India', continent: 'Asia', countryCode: 'in', url: 'https://asia-south2-5tkroniexa-em.a.run.app/api/ping' },
    { id: 'gcp-asia-southeast1', provider: 'GCP', region: 'tool.latency.regions.singapore', country: 'Singapore', continent: 'Asia', countryCode: 'sg', url: 'https://asia-southeast1-5tkroniexa-as.a.run.app/api/ping' },
    { id: 'gcp-asia-southeast2', provider: 'GCP', region: 'tool.latency.regions.jakarta', country: 'Indonesia', continent: 'Asia', countryCode: 'id', url: 'https://asia-southeast2-5tkroniexa-et.a.run.app/api/ping' },
    { id: 'gcp-australia-southeast1', provider: 'GCP', region: 'tool.latency.regions.sydney', country: 'Australia', continent: 'Oceania', countryCode: 'au', url: 'https://australia-southeast1-5tkroniexa-ts.a.run.app/api/ping' },
    { id: 'gcp-australia-southeast2', provider: 'GCP', region: 'tool.latency.regions.melbourne', country: 'Australia', continent: 'Oceania', countryCode: 'au', url: 'https://australia-southeast2-5tkroniexa-km.a.run.app/api/ping' },

    // North America
    { id: 'gcp-us-central1', provider: 'GCP', region: 'tool.latency.regions.us_iowa', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://us-central1-5tkroniexa-uc.a.run.app/api/ping' },
    { id: 'gcp-us-east1', provider: 'GCP', region: 'tool.latency.regions.us_south_carolina', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://us-east1-5tkroniexa-ue.a.run.app/api/ping' },
    { id: 'gcp-us-east4', provider: 'GCP', region: 'tool.latency.regions.us_north_virginia', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://us-east4-5tkroniexa-uk.a.run.app/api/ping' },
    { id: 'gcp-us-east5', provider: 'GCP', region: 'tool.latency.regions.us_columbus', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://us-east5-5tkroniexa-ul.a.run.app/api/ping' },
    { id: 'gcp-us-south1', provider: 'GCP', region: 'tool.latency.regions.us_dallas', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://us-south1-5tkroniexa-vp.a.run.app/api/ping' },
    { id: 'gcp-us-west1', provider: 'GCP', region: 'tool.latency.regions.us_oregon', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://us-west1-5tkroniexa-uw.a.run.app/api/ping' },
    { id: 'gcp-us-west2', provider: 'GCP', region: 'tool.latency.regions.us_los_angeles', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://us-west2-5tkroniexa-wl.a.run.app/api/ping' },
    { id: 'gcp-us-west3', provider: 'GCP', region: 'tool.latency.regions.us_salt_lake_city', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://us-west3-5tkroniexa-wm.a.run.app/api/ping' },
    { id: 'gcp-us-west4', provider: 'GCP', region: 'tool.latency.regions.us_las_vegas', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://us-west4-5tkroniexa-wn.a.run.app/api/ping' },
    { id: 'gcp-northamerica-northeast1', provider: 'GCP', region: 'tool.latency.regions.ca_montreal', country: 'Canada', continent: 'Americas', countryCode: 'ca', url: 'https://northamerica-northeast1-5tkroniexa-nn.a.run.app/api/ping' },
    { id: 'gcp-northamerica-northeast2', provider: 'GCP', region: 'tool.latency.regions.ca_toronto', country: 'Canada', continent: 'Americas', countryCode: 'ca', url: 'https://northamerica-northeast2-5tkroniexa-pd.a.run.app/api/ping' },

    // Europe
    { id: 'gcp-europe-central2', provider: 'GCP', region: 'tool.latency.regions.pl_warsaw', country: 'Poland', continent: 'Europe', countryCode: 'pl', url: 'https://europe-central2-5tkroniexa-lm.a.run.app/api/ping' },
    { id: 'gcp-europe-north1', provider: 'GCP', region: 'tool.latency.regions.fi_finland', country: 'Finland', continent: 'Europe', countryCode: 'fi', url: 'https://europe-north1-5tkroniexa-lz.a.run.app/api/ping' },
    { id: 'gcp-europe-north2', provider: 'GCP', region: 'tool.latency.regions.se_stockholm', country: 'Sweden', continent: 'Europe', countryCode: 'se', url: 'https://europe-north2-5tkroniexa-ma.a.run.app/api/ping' },
    { id: 'gcp-europe-southwest1', provider: 'GCP', region: 'tool.latency.regions.es_madrid', country: 'Spain', continent: 'Europe', countryCode: 'es', url: 'https://europe-southwest1-5tkroniexa-no.a.run.app/api/ping' },
    { id: 'gcp-europe-west1', provider: 'GCP', region: 'tool.latency.regions.be_belgium', country: 'Belgium', continent: 'Europe', countryCode: 'be', url: 'https://europe-west1-5tkroniexa-ew.a.run.app/api/ping' },
    { id: 'gcp-europe-west2', provider: 'GCP', region: 'tool.latency.regions.uk_london', country: 'UK', continent: 'Europe', countryCode: 'gb', url: 'https://europe-west2-5tkroniexa-nw.a.run.app/api/ping' },
    { id: 'gcp-europe-west3', provider: 'GCP', region: 'tool.latency.regions.de_frankfurt', country: 'Germany', continent: 'Europe', countryCode: 'de', url: 'https://europe-west3-5tkroniexa-ey.a.run.app/api/ping' },
    { id: 'gcp-europe-west4', provider: 'GCP', region: 'tool.latency.regions.nl_netherlands', country: 'Netherlands', continent: 'Europe', countryCode: 'nl', url: 'https://europe-west4-5tkroniexa-ez.a.run.app/api/ping' },
    { id: 'gcp-europe-west6', provider: 'GCP', region: 'tool.latency.regions.ch_zurich', country: 'Switzerland', continent: 'Europe', countryCode: 'ch', url: 'https://europe-west6-5tkroniexa-oa.a.run.app/api/ping' },
    { id: 'gcp-europe-west8', provider: 'GCP', region: 'tool.latency.regions.it_milan', country: 'Italy', continent: 'Europe', countryCode: 'it', url: 'https://europe-west8-5tkroniexa-oc.a.run.app/api/ping' },
    { id: 'gcp-europe-west9', provider: 'GCP', region: 'tool.latency.regions.fr_paris', country: 'France', continent: 'Europe', countryCode: 'fr', url: 'https://europe-west9-5tkroniexa-od.a.run.app/api/ping' },
    { id: 'gcp-europe-west10', provider: 'GCP', region: 'tool.latency.regions.de_berlin', country: 'Germany', continent: 'Europe', countryCode: 'de', url: 'https://europe-west10-5tkroniexa-oe.a.run.app/api/ping' },
    { id: 'gcp-europe-west12', provider: 'GCP', region: 'tool.latency.regions.it_turin', country: 'Italy', continent: 'Europe', countryCode: 'it', url: 'https://europe-west12-5tkroniexa-og.a.run.app/api/ping' },

    // Middle East & Africa
    { id: 'gcp-me-west1', provider: 'GCP', region: 'tool.latency.regions.il_tel_aviv', country: 'Israel', continent: 'MEA', countryCode: 'il', url: 'https://me-west1-5tkroniexa-zf.a.run.app/api/ping' },
    { id: 'gcp-me-central1', provider: 'GCP', region: 'tool.latency.regions.qa_doha', country: 'Qatar', continent: 'MEA', countryCode: 'qa', url: 'https://me-central1-5tkroniexa-ww.a.run.app/api/ping' },
    { id: 'gcp-me-central2', provider: 'GCP', region: 'tool.latency.regions.sa_dammam', country: 'Saudi Arabia', continent: 'MEA', countryCode: 'sa', url: 'https://me-central2-5tkroniexa-wx.a.run.app/api/ping' },
    { id: 'gcp-africa-south1', provider: 'GCP', region: 'tool.latency.regions.za_johannesburg', country: 'South Africa', continent: 'MEA', countryCode: 'za', url: 'https://africa-south1-5tkroniexa-bq.a.run.app/api/ping' },

    // South America
    { id: 'gcp-southamerica-east1', provider: 'GCP', region: 'tool.latency.regions.br_sao_paulo', country: 'Brazil', continent: 'Americas', countryCode: 'br', url: 'https://southamerica-east1-5tkroniexa-rj.a.run.app/api/ping' },
    { id: 'gcp-southamerica-west1', provider: 'GCP', region: 'tool.latency.regions.cl_santiago', country: 'Chile', continent: 'Americas', countryCode: 'cl', url: 'https://southamerica-west1-5tkroniexa-tl.a.run.app/api/ping' },


    // Azure (using s3[region] endpoints which support CORS)
    { id: 'azure-eastus', provider: 'Azure', region: 'tool.latency.regions.us_east', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://s3eastus.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-westus', provider: 'Azure', region: 'tool.latency.regions.us_west', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://s3westus.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-centralus', provider: 'Azure', region: 'tool.latency.regions.us_central', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://s3centralus.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-eastus2', provider: 'Azure', region: 'tool.latency.regions.us_east_2', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://s3eastus2.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-northcentralus', provider: 'Azure', region: 'tool.latency.regions.us_north_central', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://s3northcentralus.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-southcentralus', provider: 'Azure', region: 'tool.latency.regions.us_south_central', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://s3southcentralus.blob.core.windows.net/public/latency-test.json' },

    { id: 'azure-northeurope', provider: 'Azure', region: 'tool.latency.regions.eu_north', country: 'Ireland', continent: 'Europe', countryCode: 'ie', url: 'https://s3northeurope.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-westeurope', provider: 'Azure', region: 'tool.latency.regions.eu_west', country: 'Netherlands', continent: 'Europe', countryCode: 'nl', url: 'https://s3westeurope.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-uk-south', provider: 'Azure', region: 'tool.latency.regions.uk_south', country: 'UK', continent: 'Europe', countryCode: 'gb', url: 'https://s3uksouth.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-uk-west', provider: 'Azure', region: 'tool.latency.regions.uk_west', country: 'UK', continent: 'Europe', countryCode: 'gb', url: 'https://s3ukwest.blob.core.windows.net/public/latency-test.json' },

    { id: 'azure-southeastasia', provider: 'Azure', region: 'tool.latency.regions.asia_southeast', country: 'Singapore', continent: 'Asia', countryCode: 'sg', url: 'https://s3southeastasia.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-eastasia', provider: 'Azure', region: 'tool.latency.regions.asia_east', country: 'Hong Kong', continent: 'Asia', countryCode: 'hk', url: 'https://s3eastasia.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-japaneast', provider: 'Azure', region: 'tool.latency.regions.jp_east', country: 'Japan', continent: 'Asia', countryCode: 'jp', url: 'https://s3japaneast.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-japanwest', provider: 'Azure', region: 'tool.latency.regions.jp_west', country: 'Japan', continent: 'Asia', countryCode: 'jp', url: 'https://s3japanwest.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-centralindia', provider: 'Azure', region: 'tool.latency.regions.in_central', country: 'India', continent: 'Asia', countryCode: 'in', url: 'https://s3centralindia.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-southindia', provider: 'Azure', region: 'tool.latency.regions.in_south', country: 'India', continent: 'Asia', countryCode: 'in', url: 'https://s3southindia.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-westindia', provider: 'Azure', region: 'tool.latency.regions.in_west', country: 'India', continent: 'Asia', countryCode: 'in', url: 'https://s3westindia.blob.core.windows.net/public/latency-test.json' },

    { id: 'azure-australiaeast', provider: 'Azure', region: 'tool.latency.regions.au_east', country: 'Australia', continent: 'Oceania', countryCode: 'au', url: 'https://s3australiaeast.blob.core.windows.net/public/latency-test.json' },
    { id: 'azure-australiasoutheast', provider: 'Azure', region: 'tool.latency.regions.au_southeast', country: 'Australia', continent: 'Oceania', countryCode: 'au', url: 'https://s3australiasoutheast.blob.core.windows.net/public/latency-test.json' },

    { id: 'azure-brazilsouth', provider: 'Azure', region: 'tool.latency.regions.br_south', country: 'Brazil', continent: 'Americas', countryCode: 'br', url: 'https://s3brazilsouth.blob.core.windows.net/public/latency-test.json' },

    // AWS (WorkSpaces Health Check)
    // US
    { id: 'aws-us-east-1', provider: 'AWS', region: 'tool.latency.regions.us_east_n_virginia', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://ws-broker-service.us-east-1.amazonaws.com/ping' },
    { id: 'aws-us-east-2', provider: 'AWS', region: 'tool.latency.regions.us_east_ohio', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://ws-broker-service.us-east-2.amazonaws.com/ping' },
    { id: 'aws-us-west-1', provider: 'AWS', region: 'tool.latency.regions.us_west_n_california', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://ws-broker-service.us-west-1.amazonaws.com/ping' },
    { id: 'aws-us-west-2', provider: 'AWS', region: 'tool.latency.regions.us_west_oregon', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://ws-broker-service.us-west-2.amazonaws.com/ping' },
    // Asia Pacific
    { id: 'aws-ap-east-1', provider: 'AWS', region: 'tool.latency.regions.ap_hong_kong', country: 'Hong Kong', continent: 'Asia', countryCode: 'hk', url: 'https://ws-broker-service.ap-east-1.amazonaws.com/ping' },
    { id: 'aws-ap-south-1', provider: 'AWS', region: 'tool.latency.regions.ap_mumbai', country: 'India', continent: 'Asia', countryCode: 'in', url: 'https://ws-broker-service.ap-south-1.amazonaws.com/ping' },
    { id: 'aws-ap-northeast-3', provider: 'AWS', region: 'tool.latency.regions.ap_osaka', country: 'Japan', continent: 'Asia', countryCode: 'jp', url: 'https://ws-broker-service.ap-northeast-3.amazonaws.com/ping' },
    { id: 'aws-ap-northeast-2', provider: 'AWS', region: 'tool.latency.regions.ap_seoul', country: 'South Korea', continent: 'Asia', countryCode: 'kr', url: 'https://ws-broker-service.ap-northeast-2.amazonaws.com/ping' },
    { id: 'aws-ap-southeast-1', provider: 'AWS', region: 'tool.latency.regions.ap_singapore', country: 'Singapore', continent: 'Asia', countryCode: 'sg', url: 'https://ws-broker-service.ap-southeast-1.amazonaws.com/ping' },
    { id: 'aws-ap-southeast-2', provider: 'AWS', region: 'tool.latency.regions.ap_sydney', country: 'Australia', continent: 'Oceania', countryCode: 'au', url: 'https://ws-broker-service.ap-southeast-2.amazonaws.com/ping' },
    { id: 'aws-ap-northeast-1', provider: 'AWS', region: 'tool.latency.regions.ap_tokyo', country: 'Japan', continent: 'Asia', countryCode: 'jp', url: 'https://ws-broker-service.ap-northeast-1.amazonaws.com/ping' },
    // China
    { id: 'aws-cn-north-1', provider: 'AWS', region: 'tool.latency.regions.cn_beijing', country: 'China', continent: 'Asia', countryCode: 'cn', url: 'https://ws-broker-service.cn-north-1.amazonaws.com.cn/ping' },
    { id: 'aws-cn-northwest-1', provider: 'AWS', region: 'tool.latency.regions.cn_ningxia', country: 'China', continent: 'Asia', countryCode: 'cn', url: 'https://ws-broker-service.cn-northwest-1.amazonaws.com.cn/ping' },
    // Europe
    { id: 'aws-eu-central-1', provider: 'AWS', region: 'tool.latency.regions.eu_frankfurt', country: 'Germany', continent: 'Europe', countryCode: 'de', url: 'https://ws-broker-service.eu-central-1.amazonaws.com/ping' },
    { id: 'aws-eu-west-1', provider: 'AWS', region: 'tool.latency.regions.eu_ireland', country: 'Ireland', continent: 'Europe', countryCode: 'ie', url: 'https://ws-broker-service.eu-west-1.amazonaws.com/ping' },
    { id: 'aws-eu-west-2', provider: 'AWS', region: 'tool.latency.regions.eu_london', country: 'UK', continent: 'Europe', countryCode: 'gb', url: 'https://ws-broker-service.eu-west-2.amazonaws.com/ping' },
    { id: 'aws-eu-south-1', provider: 'AWS', region: 'tool.latency.regions.eu_milan', country: 'Italy', continent: 'Europe', countryCode: 'it', url: 'https://ws-broker-service.eu-south-1.amazonaws.com/ping' },
    { id: 'aws-eu-west-3', provider: 'AWS', region: 'tool.latency.regions.eu_paris', country: 'France', continent: 'Europe', countryCode: 'fr', url: 'https://ws-broker-service.eu-west-3.amazonaws.com/ping' },
    { id: 'aws-eu-north-1', provider: 'AWS', region: 'tool.latency.regions.eu_stockholm', country: 'Sweden', continent: 'Europe', countryCode: 'se', url: 'https://ws-broker-service.eu-north-1.amazonaws.com/ping' },
    // South America
    { id: 'aws-sa-east-1', provider: 'AWS', region: 'tool.latency.regions.sa_sao_paulo', country: 'Brazil', continent: 'Americas', countryCode: 'br', url: 'https://ws-broker-service.sa-east-1.amazonaws.com/ping' },
    // Middle East
    { id: 'aws-me-south-1', provider: 'AWS', region: 'tool.latency.regions.me_bahrain', country: 'Bahrain', continent: 'MEA', countryCode: 'bh', url: 'https://ws-broker-service.me-south-1.amazonaws.com/ping' },
    // Africa
    { id: 'aws-af-south-1', provider: 'AWS', region: 'tool.latency.regions.af_cape_town', country: 'South Africa', continent: 'MEA', countryCode: 'za', url: 'https://ws-broker-service.af-south-1.amazonaws.com/ping' },

    // Oracle (OCI) - Using iaas endpoint which returns 401/404 but is reliable
    { id: 'oci-ap-tokyo-1', provider: 'Oracle', region: 'tool.latency.regions.jp_east_tokyo', country: 'Japan', continent: 'Asia', countryCode: 'jp', url: 'https://iaas.ap-tokyo-1.oraclecloud.com/ping' },
    { id: 'oci-ap-osaka-1', provider: 'Oracle', region: 'tool.latency.regions.jp_central_osaka', country: 'Japan', continent: 'Asia', countryCode: 'jp', url: 'https://iaas.ap-osaka-1.oraclecloud.com/ping' },
    { id: 'oci-ap-seoul-1', provider: 'Oracle', region: 'tool.latency.regions.kr_central_seoul', country: 'South Korea', continent: 'Asia', countryCode: 'kr', url: 'https://iaas.ap-seoul-1.oraclecloud.com/ping' },
    { id: 'oci-ap-chuncheon-1', provider: 'Oracle', region: 'tool.latency.regions.kr_north_chuncheon', country: 'South Korea', continent: 'Asia', countryCode: 'kr', url: 'https://iaas.ap-chuncheon-1.oraclecloud.com/ping' },
    { id: 'oci-ap-singapore-1', provider: 'Oracle', region: 'tool.latency.regions.ap_singapore', country: 'Singapore', continent: 'Asia', countryCode: 'sg', url: 'https://iaas.ap-singapore-1.oraclecloud.com/ping' },
    { id: 'oci-ap-sydney-1', provider: 'Oracle', region: 'tool.latency.regions.au_east_sydney', country: 'Australia', continent: 'Oceania', countryCode: 'au', url: 'https://iaas.ap-sydney-1.oraclecloud.com/ping' },
    { id: 'oci-ap-melbourne-1', provider: 'Oracle', region: 'tool.latency.regions.au_se_melbourne', country: 'Australia', continent: 'Oceania', countryCode: 'au', url: 'https://iaas.ap-melbourne-1.oraclecloud.com/ping' },
    { id: 'oci-ap-mumbai-1', provider: 'Oracle', region: 'tool.latency.regions.in_west_mumbai', country: 'India', continent: 'Asia', countryCode: 'in', url: 'https://iaas.ap-mumbai-1.oraclecloud.com/ping' },
    { id: 'oci-ap-hyderabad-1', provider: 'Oracle', region: 'tool.latency.regions.in_south_hyderabad', country: 'India', continent: 'Asia', countryCode: 'in', url: 'https://iaas.ap-hyderabad-1.oraclecloud.com/ping' },
    { id: 'oci-il-jerusalem-1', provider: 'Oracle', region: 'tool.latency.regions.il_central_jerusalem', country: 'Israel', continent: 'MEA', countryCode: 'il', url: 'https://iaas.il-jerusalem-1.oraclecloud.com/ping' },

    { id: 'oci-us-ashburn-1', provider: 'Oracle', region: 'tool.latency.regions.us_east_ashburn', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://iaas.us-ashburn-1.oraclecloud.com/ping' },
    { id: 'oci-us-phoenix-1', provider: 'Oracle', region: 'tool.latency.regions.us_west_phoenix', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://iaas.us-phoenix-1.oraclecloud.com/ping' },
    { id: 'oci-us-sanjose-1', provider: 'Oracle', region: 'tool.latency.regions.us_west_san_jose', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://iaas.us-sanjose-1.oraclecloud.com/ping' },
    { id: 'oci-ca-montreal-1', provider: 'Oracle', region: 'tool.latency.regions.ca_se_montreal', country: 'Canada', continent: 'Americas', countryCode: 'ca', url: 'https://iaas.ca-montreal-1.oraclecloud.com/ping' },
    { id: 'oci-ca-toronto-1', provider: 'Oracle', region: 'tool.latency.regions.ca_se_toronto', country: 'Canada', continent: 'Americas', countryCode: 'ca', url: 'https://iaas.ca-toronto-1.oraclecloud.com/ping' },
    { id: 'oci-mx-queretaro-1', provider: 'Oracle', region: 'tool.latency.regions.mx_central_queretaro', country: 'Mexico', continent: 'Americas', countryCode: 'mx', url: 'https://iaas.mx-queretaro-1.oraclecloud.com/ping' },
    { id: 'oci-mx-monterrey-1', provider: 'Oracle', region: 'tool.latency.regions.mx_ne_monterrey', country: 'Mexico', continent: 'Americas', countryCode: 'mx', url: 'https://iaas.mx-monterrey-1.oraclecloud.com/ping' },

    { id: 'oci-uk-london-1', provider: 'Oracle', region: 'tool.latency.regions.uk_south_london', country: 'UK', continent: 'Europe', countryCode: 'gb', url: 'https://iaas.uk-london-1.oraclecloud.com/ping' },
    { id: 'oci-uk-cardiff-1', provider: 'Oracle', region: 'tool.latency.regions.uk_west_newport', country: 'UK', continent: 'Europe', countryCode: 'gb', url: 'https://iaas.uk-cardiff-1.oraclecloud.com/ping' },
    { id: 'oci-eu-frankfurt-1', provider: 'Oracle', region: 'tool.latency.regions.de_central_frankfurt', country: 'Germany', continent: 'Europe', countryCode: 'de', url: 'https://iaas.eu-frankfurt-1.oraclecloud.com/ping' },
    { id: 'oci-eu-zurich-1', provider: 'Oracle', region: 'tool.latency.regions.ch_north_zurich', country: 'Switzerland', continent: 'Europe', countryCode: 'ch', url: 'https://iaas.eu-zurich-1.oraclecloud.com/ping' },
    { id: 'oci-eu-stockholm-1', provider: 'Oracle', region: 'tool.latency.regions.se_central_stockholm', country: 'Sweden', continent: 'Europe', countryCode: 'se', url: 'https://iaas.eu-stockholm-1.oraclecloud.com/ping' },
    { id: 'oci-eu-amsterdam-1', provider: 'Oracle', region: 'tool.latency.regions.nl_nw_amsterdam', country: 'Netherlands', continent: 'Europe', countryCode: 'nl', url: 'https://iaas.eu-amsterdam-1.oraclecloud.com/ping' },
    { id: 'oci-eu-paris-1', provider: 'Oracle', region: 'tool.latency.regions.fr_central_paris', country: 'France', continent: 'Europe', countryCode: 'fr', url: 'https://iaas.eu-paris-1.oraclecloud.com/ping' },
    { id: 'oci-eu-marseille-1', provider: 'Oracle', region: 'tool.latency.regions.fr_south_marseille', country: 'France', continent: 'Europe', countryCode: 'fr', url: 'https://iaas.eu-marseille-1.oraclecloud.com/ping' },
    { id: 'oci-eu-madrid-1', provider: 'Oracle', region: 'tool.latency.regions.es_central_madrid', country: 'Spain', continent: 'Europe', countryCode: 'es', url: 'https://iaas.eu-madrid-1.oraclecloud.com/ping' },
    { id: 'oci-eu-milan-1', provider: 'Oracle', region: 'tool.latency.regions.it_nw_milan', country: 'Italy', continent: 'Europe', countryCode: 'it', url: 'https://iaas.eu-milan-1.oraclecloud.com/ping' },

    { id: 'oci-me-dubai-1', provider: 'Oracle', region: 'tool.latency.regions.ae_east_dubai', country: 'UAE', continent: 'MEA', countryCode: 'ae', url: 'https://iaas.me-dubai-1.oraclecloud.com/ping' },
    { id: 'oci-me-abudhabi-1', provider: 'Oracle', region: 'tool.latency.regions.ae_central_abu_dhabi', country: 'UAE', continent: 'MEA', countryCode: 'ae', url: 'https://iaas.me-abudhabi-1.oraclecloud.com/ping' },
    { id: 'oci-me-jeddah-1', provider: 'Oracle', region: 'tool.latency.regions.sa_west_jeddah', country: 'Saudi Arabia', continent: 'MEA', countryCode: 'sa', url: 'https://iaas.me-jeddah-1.oraclecloud.com/ping' },
    { id: 'oci-af-johannesburg-1', provider: 'Oracle', region: 'tool.latency.regions.za_central_johannesburg', country: 'South Africa', continent: 'MEA', countryCode: 'za', url: 'https://iaas.af-johannesburg-1.oraclecloud.com/ping' },

    { id: 'oci-sa-saopaulo-1', provider: 'Oracle', region: 'tool.latency.regions.br_east_sao_paulo', country: 'Brazil', continent: 'Americas', countryCode: 'br', url: 'https://iaas.sa-saopaulo-1.oraclecloud.com/ping' },
    { id: 'oci-sa-vinhedo-1', provider: 'Oracle', region: 'tool.latency.regions.br_south_vinhedo', country: 'Brazil', continent: 'Americas', countryCode: 'br', url: 'https://iaas.sa-vinhedo-1.oraclecloud.com/ping' },
    { id: 'oci-sa-santiago-1', provider: 'Oracle', region: 'tool.latency.regions.cl_central_santiago', country: 'Chile', continent: 'Americas', countryCode: 'cl', url: 'https://iaas.sa-santiago-1.oraclecloud.com/ping' },
    { id: 'oci-sa-bogota-1', provider: 'Oracle', region: 'tool.latency.regions.co_central_bogota', country: 'Colombia', continent: 'Americas', countryCode: 'co', url: 'https://iaas.sa-bogota-1.oraclecloud.com/ping' },

    // Contabo
    { id: 'contabo-pme', provider: 'Contabo', region: 'tool.latency.regions.eu_paris_munich', country: 'Europe', continent: 'Europe', countryCode: 'eu', url: 'https://ecomping-pme.contabo.net/ping' },
    { id: 'contabo-ony', provider: 'Contabo', region: 'tool.latency.regions.us_east_new_york', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://ecomping-ony.contabo.net/ping' },
    { id: 'contabo-sea', provider: 'Contabo', region: 'tool.latency.regions.us_west_seattle', country: 'USA', continent: 'Americas', countryCode: 'us', url: 'https://ecomping-sea.contabo.net/ping' },
    { id: 'contabo-sin', provider: 'Contabo', region: 'tool.latency.regions.singapore', country: 'Singapore', continent: 'Asia', countryCode: 'sg', url: 'https://ecomping-sin.contabo.net/ping' },
    { id: 'contabo-tyo', provider: 'Contabo', region: 'tool.latency.regions.jp_tokyo', country: 'Japan', continent: 'Asia', countryCode: 'jp', url: 'https://ecomping-tyo.contabo.net/ping' },
    { id: 'contabo-syd', provider: 'Contabo', region: 'tool.latency.regions.au_sydney', country: 'Australia', continent: 'Oceania', countryCode: 'au', url: 'https://ecomping-syd.contabo.net/ping' },
];

// Fallback to fetch HEAD mode: 'no-cors'
// This measures TCP connect + TLS handshake + First Byte approximation essentially
const measureLatency = async (target: TestTarget): Promise<number> => {
    const start = performance.now();

    // 1. Contabo (Official API, supports CORS, returns JSON)
    if (target.provider === 'Contabo') {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
        try {
            const response = await fetch(target.url, {
                signal: controller.signal,
                // Default mode is 'cors'
            });
            clearTimeout(id);
            const data = await response.json();
            return Math.round(Number(data.latency_ms || 0));
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }

    // 3. AWS, GCP, Oracle (Fetch Probe, Opaque/No-CORS)
    // Use 'no-cors' to allow probing opaque resources. 
    // Network errors (DNS/Connection Refused) will reject, providing a strict failure check.
    // Note: Azure Blob Storage often doesn't return CORS headers for specific origins, so no-cors is required.
    // Update: Azure 'no-cors' fetch often fails/times out in strict browsers (red 200 OK). 
    // We let Azure fall through to Image ping (which handles "content-type mismatch" as completion).
    if (['AWS', 'GCP', 'Oracle'].includes(target.provider)) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
        try {
            await fetch(target.url, {
                signal: controller.signal,
                mode: 'no-cors',
                cache: 'no-cache'
            });
            clearTimeout(id);
            const end = performance.now();
            return Math.round(end - start);
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }

    // Image Ping for others (Faster/Lower overhead than fetch HEAD)
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('Timeout'));
        }, TIMEOUT_MS);

        const img = new Image();
        const finish = () => {
            clearTimeout(timeoutId);
            const end = performance.now();
            resolve(Math.round(end - start));
        };

        // Both success (valid image) and error (not an image/404) mean we reached the server
        img.onload = finish;
        img.onerror = finish;

        img.src = target.url;
    });
};

export const LatencyTools: React.FC = () => {
    const { t } = useAppContext();
    const [results, setResults] = useState<Record<string, TestResult>>({});
    const [isRunning, setIsRunning] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<string>('All');
    const [selectedContinent, setSelectedContinent] = useState<string>('All');

    // Use a ref to control the loop to allow stopping
    const abortRef = useRef<boolean>(false);

    // Filter targets based on selection
    const filteredTargets = React.useMemo(() => {
        return targets.filter(target => {
            const matchProvider = selectedProvider === 'All' || target.provider === selectedProvider;
            const matchContinent = selectedContinent === 'All' || target.continent === selectedContinent;
            return matchProvider && matchContinent;
        });
    }, [selectedProvider, selectedContinent]);

    const getLatencyColor = (ms: number | null) => {
        if (ms === null) return 'text-red-500';
        if (ms < 50) return 'text-green-500';
        if (ms < 150) return 'text-blue-500';
        if (ms < 300) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getLatencyBg = (ms: number | null) => {
        if (ms === null) return 'bg-red-500/10 border-red-500/20';
        if (ms < 50) return 'bg-green-500/10 border-green-500/20';
        if (ms < 150) return 'bg-blue-500/10 border-blue-500/20';
        if (ms < 300) return 'bg-yellow-500/10 border-yellow-500/20';
        return 'bg-red-500/10 border-red-500/20';
    };

    const startTest = async () => {
        if (isRunning) return;

        setIsRunning(true);
        abortRef.current = false;

        // Reset results for current view
        const initialResults: Record<string, TestResult> = { ...results };
        filteredTargets.forEach(t => {
            initialResults[t.id] = { latency: null, status: 'pending' };
        });
        setResults(initialResults);

        // Process in batches
        for (let i = 0; i < filteredTargets.length; i += BATCH_SIZE) {
            if (abortRef.current) break;

            const batch = filteredTargets.slice(i, i + BATCH_SIZE);

            // Mark batch as testing
            setResults(prev => {
                const next = { ...prev };
                batch.forEach(item => {
                    next[item.id] = { ...next[item.id], status: 'testing' };
                });
                return next;
            });

            // Run tests in parallel for the batch
            const batchPromises = batch.map(async (target) => {
                try {
                    // Measure twice to warm up connection and get best result (TCP Keep-Alive effect)
                    const l1 = await measureLatency(target).catch(() => null);
                    // Small delay to ensure connection is ready for reuse if needed, though usually immediate is fine
                    const l2 = await measureLatency(target).catch(() => null);

                    if (l1 === null && l2 === null) throw new Error('Timeout');

                    // Get minimum valid latency
                    const validLatencies = [l1, l2].filter((l): l is number => l !== null);
                    const latency = Math.min(...validLatencies);

                    return { id: target.id, latency, status: 'done' as const };
                } catch (e) {
                    return { id: target.id, latency: null, status: 'error' as const };
                }
            });

            const batchResults = await Promise.all(batchPromises);

            // Update results
            setResults(prev => {
                const next = { ...prev };
                batchResults.forEach(res => {
                    next[res.id] = { latency: res.latency, status: res.status };
                });
                return next;
            });
        }

        setIsRunning(false);
    };

    const stopTest = () => {
        abortRef.current = true;
        setIsRunning(false);
    };

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            abortRef.current = true;
        };
    }, []);

    const providerOptions: SelectOption[] = [
        { value: 'All', label: t('tool.latency.provider.all'), desc: t('tool.latency.provider.desc.all') },
        { value: 'AWS', label: 'AWS', desc: t('tool.latency.provider.desc.aws') },
        { value: 'GCP', label: 'GCP', desc: t('tool.latency.provider.desc.gcp') },
        { value: 'Azure', label: 'Azure', desc: t('tool.latency.provider.desc.azure') },
        { value: 'Oracle', label: 'Oracle', desc: t('tool.latency.provider.desc.oracle') },
        { value: 'Contabo', label: 'Contabo', desc: t('tool.latency.provider.desc.contabo') },
    ];

    const continentOptions: SelectOption[] = [
        { value: 'All', label: t('tool.latency.region.all'), desc: t('tool.latency.region.desc.all') },
        { value: 'Asia', label: t('tool.latency.region.asia'), desc: t('tool.latency.region.desc.asia') },
        { value: 'Americas', label: t('tool.latency.region.americas'), desc: t('tool.latency.region.desc.americas') },
        { value: 'Europe', label: t('tool.latency.region.europe'), desc: t('tool.latency.region.desc.europe') },
        { value: 'MEA', label: t('tool.latency.region.mea'), desc: t('tool.latency.region.desc.mea') },
        { value: 'Oceania', label: t('tool.latency.region.oceania'), desc: t('tool.latency.region.desc.oceania') },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {t('tool.latency.title')}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            {t('tool.latency.desc')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    {/* Provider Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {t('tool.latency.filter.provider')}:
                        </label>
                        <CustomSelect
                            options={providerOptions}
                            value={selectedProvider}
                            onChange={(val) => setSelectedProvider(val)}
                            className="w-48"
                        />
                    </div>

                    {/* Region Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {t('tool.latency.filter.region')}:
                        </label>
                        <CustomSelect
                            options={continentOptions}
                            value={selectedContinent}
                            onChange={(val) => setSelectedContinent(val)}
                            className="w-48"
                        />
                    </div>

                    <div className="flex-1" />

                    <div>
                        {!isRunning ? (
                            <button
                                onClick={startTest}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
                            >
                                <span>{t('tool.latency.start')}</span>
                                <span className="text-sm opacity-80">({filteredTargets.length})</span>
                            </button>
                        ) : (
                            <button
                                onClick={stopTest}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-red-500/20 active:scale-95"
                            >
                                {t('tool.latency.stop')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTargets.map((target) => {
                    const result = results[target.id] || { latency: null, status: 'pending' };
                    const isPending = result.status === 'pending';
                    const isTesting = result.status === 'testing';
                    const isDone = result.status === 'done';
                    const isError = result.status === 'error';

                    let latencyDisplay = '-';
                    let statusColor = 'text-slate-400';
                    let cardBorderClass = 'border-slate-200 dark:border-slate-800';
                    let pillClass = 'bg-slate-100 dark:bg-slate-800 text-slate-500';

                    if (isTesting) {
                        latencyDisplay = 'Testing...';
                        statusColor = 'text-blue-500 animate-pulse';
                        cardBorderClass = 'border-blue-500 ring-1 ring-blue-500';
                    } else if (isDone) {
                        latencyDisplay = `${result.latency} ms`;
                        statusColor = getLatencyColor(result.latency);
                        pillClass = getLatencyBg(result.latency);
                        cardBorderClass = result.latency && result.latency > 300
                            ? 'border-red-200 dark:border-red-900' // Subtle warning border
                            : 'border-slate-200 dark:border-slate-800';
                    } else if (isError) {
                        latencyDisplay = 'Timeout';
                        statusColor = 'text-red-500';
                        pillClass = 'bg-red-500/10 border-red-500/20 text-red-500';
                    }

                    return (
                        <Card key={target.id} className={`transition-all duration-300 ${cardBorderClass}`}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={`https://flagcdn.com/w40/${target.countryCode}.png`}
                                        srcSet={`https://flagcdn.com/w80/${target.countryCode}.png 2x`}
                                        width="24"
                                        height="18"
                                        alt={target.country}
                                        className="rounded-sm shadow-sm"
                                    />
                                    <div>
                                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                                            {target.provider}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            {t(target.region)}
                                        </div>
                                    </div>
                                </div>

                                <div className={`px-3 py-1 rounded-full text-sm font-bold border ${pillClass} ${statusColor}`}>
                                    {latencyDisplay}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredTargets.length === 0 && (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    No endpoints found matching filters.
                </div>
            )}
        </div>
    );
};
