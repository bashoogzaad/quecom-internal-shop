import { writeFile } from 'fs';

const targetPath = `./src/environments/environment.ts`;
const envConfigFile = `
export const environment = {
    production: true,
    version: "v3",
    apiUrl: "https://api.quecom.nl/customer",
    apiKey: "AnOLxkRVFiiPFRc6pvLWTslZvtoAESXQBwMfD7JI",
    debtorNumber: "103208"
};
`;

writeFile(targetPath, envConfigFile, function (err) {
    if (err) { console.log(err); }
    console.log('EnvConfigFile: '+envConfigFile);
    console.log(`Output generated at ${targetPath}`);
});