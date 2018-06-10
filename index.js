// const fs = require('fs')

// fs.readdir('C:\\tss-git\\sis', (err, data)=> {
//   const x = data.map(m=> ({id: `sis%2F${m}`, setup: true, package: true}))

//   console.log(JSON.stringify(x))
// })

const axios = require('axios');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async;

const GITLAB_URL = 'https://gitlab.tss.com.ar';
const GITLAB_API_URL = `${GITLAB_URL}/api/v4`;
const {GITLAB_USER_ID, GITLAB_API_TOKEN} = process.env;

if ([GITLAB_USER_ID, GITLAB_API_TOKEN].some(s => !s)) {
  console.error('you must export $GITLAB_USER_ID');
  process.exit(1);
}

(async () => {
  const projects = [
    {id: 'sis-access-api', group: 'sis', setup: true, package: false, scripts: true},
    {id: 'sis-access-service', group: 'sis', setup: true, package: false, scripts: true},
    {id: 'sis-access-web', group: 'sis', setup: true, package: false, scripts: true},
    {id: 'sis-alerting-api', group: 'sis', setup: true, package: false, scripts: true},
    {id: 'sis-alerting-service', group: 'sis', setup: true, package: false, scripts: true},
    {id: 'sis-authorizer-service', group: 'sis', setup: true, package: true, scripts: true},
    {id: 'sis-comm-service', group: 'sis', setup: true, package: true, scripts: true},
    {id: 'sis-controlpanel-api', group: 'sis', setup: true, package: false, scripts: true},
    {id: 'sis-controlpanel-web', group: 'sis', setup: true, package: false, scripts: true},
    {id: 'sis-modbus-service', group: 'sis', setup: true, package: true, scripts: true},
    {id: 'sis-presentismo-api', group: 'sis', setup: true, package: true, scripts: true},
    {id: 'sis-presentismo-service', group: 'sis', setup: true, package: true, scripts: true},
    {id: 'sis-presentismo-web', group: 'sis', setup: true, package: false, scripts: true},
    {id: 'sis-rtu-simulator', group: 'sis', setup: true, package: true, scripts: true},
    {id: 'sis-telemetry-api', group: 'sis', setup: true, package: true, scripts: true},
    {id: 'sis-telemetry-service', group: 'sis', setup: true, package: true, scripts: true},
    {id: 'sis-telemetry-web', group: 'sis', setup: true, package: false, scripts: true},
    {id: 'sis-visits-api', group: 'sis', setup: true, package: true, scripts: true},
    {id: 'sis-visits-web', group: 'sis', setup: true, package: false, scripts: true},
    {id: 'sis-zkaccessscrapper-service', group: 'sis', setup: true, package: false, scripts: true},
  ];

  await asyncForEach(projects, async project => {
    try {
      const projectId = `${project.group}%2F${project.id}`;
      const issuesUrl = `${GITLAB_API_URL}/projects/${projectId}/issues`;

      process.stdout.write();

      if (project.package) {
        const data = {
          title: 'Migración de package.config a PackageReference',
          assignee_ids: [GITLAB_USER_ID],
          labels: 'type: chore',
        };

        await axios.post(issuesUrl, data, {
          headers: {'PRIVATE-TOKEN': GITLAB_API_TOKEN},
        });

        console.log(`${project.id}: package ✔️`);

        process.exit(0);
      }

      if (project.setup) {
        const data = {
          title: 'Arreglo del archivo de log en el setup',
          assignee_ids: [GITLAB_USER_ID],
          labels: 'type: chore',
        };

        // await axios.post(issuesUrl, data, {
        //   headers: {'PRIVATE-TOKEN': GITLAB_API_TOKEN}
        // });

        console.log(`${project.id}: setup ✔️`);
      }

      if (project.scripts) {
        const data = {
          title: 'Arreglo de los scripts de release',
          assignee_ids: [GITLAB_USER_ID],
          labels: 'type: chore',
        };

        // await axios.post(issuesUrl, data, {
        //   headers: {'PRIVATE-TOKEN': GITLAB_API_TOKEN}
        // });

        console.log(`${project.id}: scripts ✔️`);
      }
    } catch (err) {
      console.log('err: ', err);

      process.exit(1);
    }
  });
})();
