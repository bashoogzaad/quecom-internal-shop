import { writeFile } from 'fs';

const targetPath = `./src/environments/environment.ts`;
const envConfigFile = `
export const environment = {
    production: true,
    version: "v3",
    apiUrl: "https://api.quecom.nl/customer",
    apiKey: "l5CJaVRlvuWW2JwBi2fqsvyQBu1KZdW2AxPYhxW1",
    debtorNumber: "103318"
};
`;

writeFile(targetPath, envConfigFile, function (err) {
    if (err) { console.log(err); }
    console.log('EnvConfigFile: '+envConfigFile);
    console.log(`Output generated at ${targetPath}`);
});