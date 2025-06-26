import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnumUtilsService {

  constructor() { }

  getEnumValue<T extends Record<string, string>>(enumObj: T, value: string): string | undefined {
    if (Object.keys(enumObj).includes(value)) {
      return enumObj[value]
    } else {
      return undefined
    }
  }

  getEnumKey<T extends Record<string, string>>(enumObj: T, value: string): string | undefined {
    if (Object.values(enumObj).includes(value)) {
      return Object.keys(enumObj).find(key => enumObj[key] === value)
    } else {
      return undefined
    }
  }
}
