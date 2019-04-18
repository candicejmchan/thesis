const fs=require ("fs");
const path = require('path');
const rp = require('request-promise-native');

const outputFolderPath = path.join(__dirname, 'data');
if (!fs.existsSync(outputFolderPath)) {
  fs.mkdir(outputFolderPath, (err) => {
    if (err) throw err;
  });
}

const keys = [
  'nppes_provider_state',
  'opioid_drug_cost',
  'opioid_prescriber_rate',
  'opioid_drug_cost',
  'brand_drug_cost',
  'generic_drug_cost',
  'total_drug_cost',
  'la_opioid_prescriber_rate',
  'la_opioid_drug_cost',
  'specialty_description',
  'other_claim_count',
  'opioid_claim_count',
  'nppes_provider_city',
  'nppes_provider_first_name',
  'nppes_provider_last_org_name',
  'total_claim_count_ge65',
  'generic_claim_count',
  'brand_claim_count',
  'la_opioid_claim_count',
  'antibiotic_claim_count',
  'antipsych_claim_count_ge65',
  'total_claim_count'
];

const createRequest = (url) => {
  return rp({
    uri: url,
    method: 'GET',
    json: true
  })
};

const filterData = (data, keys) => {
  const filteredData = data.map(d => {
      const temp = {};
      keys.forEach(key => {
        if(d[key]) {
          temp[key] = +d[key] || d[key];
        }
      });
      return temp;
  });
  return filteredData;
};

const urls = [
  {url: 'https://data.cms.gov/resource/wynz-2bqg.json', name: '2013.json'},
  {url: 'https://data.cms.gov/resource/5i8t-h864.json', name: '2014.json'},
  {url: 'https://data.cms.gov/resource/4mqk-eggb.json', name: '2015.json'},
  {url: 'https://data.cms.gov/resource/ep4w-t37d.json', name: '2016.json'}
];

const promises = urls.map(d => createRequest(d.url));

Promise.all(promises)
.then(d => {
  const result = d.map(data => filterData(data, keys));

  result.forEach( (data, index) => {
    const outputFilePath = path.join(outputFolderPath, urls[index].name);
    const outputData = JSON.stringify(data, null, 4);
    fs.writeFile(outputFilePath, outputData, 'utf8', (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  });
})

/*fs.readFile("./data.json", 'utf8', (err, data) => {
  data = JSON.parse(data);

    console.log(filteredData[20]);
});*/
