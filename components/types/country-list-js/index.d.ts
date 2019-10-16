// Type definitions for country-list-js
// Definitions by: embeddedt
export interface CountryListProvince {
    name: string;
    alias: string[];
}
export interface CountryListObject {
    name: string;
    continent: string;
    region: string;
    capital: string;
    currency: {
        code: string;
        symbol: string;
        decimal: string;
    };
    dialing_code: string;
    provinces: Array<CountryListProvince>;
    code: {
        iso_alpha_2?: string;
        iso_alpha_3?: string;
    };
}
export function names(): string[];
export function continents(): string[];
export function capitals(): string[];
export function ls(type: 'country'|'continent'|'capital'): string[];
export function findByIso2(code: string): CountryListObject;
export function findByIso3(code: string): CountryListObject;
export function findByName(code: string): CountryListObject;
export function findByCapital(code: string): CountryListObject;
export function findByCurrency(code: string): CountryListObject;
export function findByPhoneNbr(code: string): CountryListObject;
export function findByProvince(code: string): CountryListObject;