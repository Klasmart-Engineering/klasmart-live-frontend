import { en } from './en'
import { vi } from './vi'

export function getLocalizationMessages (locale: string) {
  switch (locale) {
    default:
      return en
    case 'vie':
    case 'vi':
      return vi
  }
}
