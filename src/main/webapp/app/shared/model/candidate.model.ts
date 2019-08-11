import { IAdvertisement } from 'app/shared/model/advertisement.model';

export interface ICandidate {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  advertisements?: IAdvertisement[];
}

export const defaultValue: Readonly<ICandidate> = {};
