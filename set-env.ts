import { writeFile } from 'fs';

const targetPath = `./src/environments/environment.ts`;
const envConfigFile = `
export const environment = {
    production: ${process.env.PRODUCTION},
    version: "${process.env.VERSION}",
    apiUrl: "${process.env.API_URL}",
    apiKey: "${process.env.API_KEY}",
    debtorNumber: "${process.env.DEBTOR_NUMBER}"
};
`;

writeFile(targetPath, envConfigFile, function (err) {
    if (err) { console.log(err); }
    console.log('EnvConfigFile: '+envConfigFile);
    console.log(`Output generated at ${targetPath}`);
});