import { writeFile } from 'fs';

const targetPath = `./src/environments/environment.ts`;
const envConfigFile = `
export const environment = {
    production: true,
    version: "v3",
    apiUrl: "https://api.quecom.nl/customer",
    apiKey: "oLouAeGDj9DgQfUzP6sLjsNzFqB5QXROmPBg4Z2t",
    debtorNumber: "103252"
};
`;

writeFile(targetPath, envConfigFile, function (err) {
    if (err) { console.log(err); }
    console.log('EnvConfigFile: '+envConfigFile);
    console.log(`Output generated at ${targetPath}`);
});
