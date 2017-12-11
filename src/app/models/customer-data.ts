export class CustomerData {
    gender: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    companyName: string;
    address: string;
    houseNumber: string;
    houseNumberExtension: string;
    postalCode: string;
    city: string;
    phoneNumber: string;
    country: string;

    genderSh: string;
    firstNameSh: string;
    lastNameSh: string;
    emailAddressSh: string;
    companyNameSh: string;
    addressSh: string;
    houseNumberSh: string;
    houseNumberExtensionSh: string;
    postalCodeSh: string;
    citySh: string;
    phoneNumberSh: string;
    countrySh: string;

    remarks: string;

    constructor() {
        this.country = 'NL';
        this.countrySh = 'NL';
    }

}