import { writeFile } from 'fs';

const targetPath = `./src/environments/environment.ts`;
const envConfigFile = `
export const environment = {
    production: true,
    version: "v3",
    apiUrl: "https://api.quecom.nl/customer",
    apiKey: "CeWgpOSVF9ok6SgsmN0XFDkbQeBoxZMXlJjNZgGD",
    debtorNumber: "102094"
};
`;

writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        console.log(err);
    }

    console.log(`Output generated at ${targetPath}`);
});
