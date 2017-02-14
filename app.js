
const express = require('express');
const app = express();

/*** APPTYPE: WEB - START ***/
app.use(express.static(__dirname + '/public'));
/*** APPTYPE: WEB - END ***/

let vcapServices = '';
if (process.env.VCAP_SERVICES) {
    vcapServices = JSON.parse(process.env.VCAP_SERVICES);
} else {
    vcapServices = require('./services.json');
    //vcapServices = JSON.parse(parsedJSON)
}

/*** OPTION: Object-Storage - START ***/
// Load the object-storage library.
const pkgcloud = require('pkgcloud');
const ObjectStorageConfig = {
    provider: 'openstack',
    useServiceCatalog: true,
    useInternal: false,
    keystoneAuthVersion: 'v3',
    authUrl: vcapServices['Object-Storage'][0].credentials.auth_url,
    tenantId: vcapServices['Object-Storage'][0].credentials.projectId,
    domainId: vcapServices['Object-Storage'][0].credentials.domainId,
    username: vcapServices['Object-Storage'][0].credentials.username,
    password: vcapServices['Object-Storage'][0].credentials.password,
    region: vcapServices['Object-Storage'][0].credentials.region
};

const ObjectStorage = pkgcloud.storage.createClient(ObjectStorageConfig);

ObjectStorage.auth(function(err) {
    if (err) {
        console.error(err);
    }
});
/*** OPTION: ObjectStorage - END ***/

const port = 'PORT' in process.env ? process.env.PORT : 6969

app.listen(port, function () {
  console.log(`Example app listening on port ${this.address().port}!`)
})
