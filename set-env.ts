import { writeFile } from 'fs';

const targetPath = `./src/environments/environment.ts`;
const envConfigFile = `
export const environment = {
    production: true,
    version: "v3",
    apiUrl: "https://api.quecom.nl/customer",
    apiKey: "YgPDN2CGOavpg1RIqqKbRHM9ELzwtE6W6VaY9kCA",
    debtorNumber: "103334"
};
`;

writeFile(targetPath, envConfigFile, function (err) {
    if (err) { console.log(err); }
    console.log('EnvConfigFile: '+envConfigFile);
    console.log(`Output generated at ${targetPath}`);
});
