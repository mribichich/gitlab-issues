// const fs = require('fs')

// fs.readdir('C:\\tss-git\\sis', (err, data)=> {
//   const x = data.map(m=> ({id: `sis%2F${m}`, setup: true, package: true}))

//   console.log(JSON.stringify(x))
// })

const axios = require('axios');

const {asyncForEach, logLine, log} = require('./utils');

const GITLAB_URL = 'https://gitlab.tss.com.ar';
const GITLAB_API_URL = `${GITLAB_URL}/api/v4`;
const {GITLAB_USER_ID, GITLAB_API_TOKEN} = process.env;

if ([GITLAB_USER_ID, GITLAB_API_TOKEN].some(s => !s)) {
  console.error('you must export $GITLAB_USER_ID');
  process.exit(1);
}

(async () => {
  const projects = [
    {group: 'sis', name: 'sis-access-api', setup: false, package: false, scripts: false},
    {group: 'sis', name: 'sis-access-service', setup: false, package: false, scripts: false},
    {group: 'sis', name: 'sis-access-web', setup: false, package: false, scripts: false},
    {group: 'sis', name: 'sis-alerting-api', setup: false, package: false, scripts: false},
    {group: 'sis', name: 'sis-alerting-service', setup: false, package: false, scripts: false},
    {group: 'sis', name: 'sis-authorizer-service', setup: true, package: false, scripts: true},
    {group: 'sis', name: 'sis-comm-service', setup: true, package: true, scripts: true},
    {group: 'sis', name: 'sis-controlpanel-api', setup: true, package: false, scripts: true},
    {group: 'sis', name: 'sis-controlpanel-web', setup: true, package: false, scripts: true},
    {group: 'sis', name: 'sis-modbus-service', setup: true, package: true, scripts: true},
    {group: 'sis', name: 'sis-presentismo-api', setup: true, package: true, scripts: true},
    {group: 'sis', name: 'sis-presentismo-service', setup: true, package: true, scripts: true},
    {group: 'sis', name: 'sis-presentismo-web', setup: true, package: false, scripts: true},
    {group: 'sis', name: 'sis-rtu-simulator', setup: true, package: true, scripts: true},
    {group: 'sis', name: 'sis-telemetry-api', setup: true, package: true, scripts: true},
    {group: 'sis', name: 'sis-telemetry-service', setup: true, package: true, scripts: true},
    {group: 'sis', name: 'sis-telemetry-web', setup: true, package: false, scripts: true},
    {group: 'sis', name: 'sis-visits-api', setup: true, package: true, scripts: true},
    {group: 'sis', name: 'sis-visits-web', setup: true, package: false, scripts: true},
    {group: 'sis', name: 'sis-zkaccessscrapper-service', setup: true, package: false, scripts: true},
  ];

  const instance = axios.create({
    baseURL: `${GITLAB_API_URL}/projects/`,
    timeout: 30000,
    headers: {'PRIVATE-TOKEN': GITLAB_API_TOKEN},
  });

  await asyncForEach(projects, async project => {
    try {
      const projectId = `${project.group}%2F${project.name}`;
      const issuesUrl = `${projectId}/issues`;

      log(`${project.name}:  `);

      if (project.package) {
        log(`  package `);

        const data = {
          title: 'Migración de package.config a PackageReference',
          assignee_ids: [GITLAB_USER_ID],
          labels: 'type: chore',
        };

        await instance.post(issuesUrl, data);

        log(`✔️  `);
      }

      if (project.setup) {
        log(`  setup `);

        const data = {
          title: 'Arreglo del archivo de log en el setup',
          assignee_ids: [GITLAB_USER_ID],
          labels: 'type: chore',
        };

        await instance.post(issuesUrl, data);

        log(`✔️  `);
      }

      if (project.scripts) {
        log(`  scripts `);

        const data = {
          title: 'Arreglo de los scripts de release',
          assignee_ids: [GITLAB_USER_ID],
          labels: 'type: chore',
        };

        await instance.post(issuesUrl, data);

        log(`✔️  `);
      }

      logLine();
    } catch (err) {
      console.error('err: ', err);

      process.exit(1);
    }
  });
})();
