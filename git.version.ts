import { writeFileSync } from 'fs';
import { dedent } from 'tslint/lib/utils';
import { promisify } from 'util';
import * as child from 'child_process';
const exec = promisify(child.exec);
const packageJSON = require('./package.json');


async function createVersionsFile(filename: string) {
  const revision = (await exec('git rev-parse --short HEAD')).stdout.toString().trim();
  const branch = (await exec('git rev-parse --abbrev-ref HEAD')).stdout.toString().trim();
  const date = (await exec('git log -1 --format=%cd')).stdout.toString().trim();
  const lastMessage = (await exec('git log -n 1 --skip 1 --pretty=format:"%s"')).stdout.toString().trim();
 
  console.log(`Application Version: '${packageJSON.version}', revision: '${revision}', branch: '${branch}'`);

  const content = dedent`
      // This file is automatically generated by git.version.ts script
      export const applicationversion = {
        version: '${packageJSON.version}',
        revision: '${revision}',
        branch: '${branch}',
        date: '${date}',
        message: '${lastMessage}'
      };`;

  writeFileSync(filename, content, {encoding: 'utf8'});
}

createVersionsFile('src/environments/applicationversion.ts');