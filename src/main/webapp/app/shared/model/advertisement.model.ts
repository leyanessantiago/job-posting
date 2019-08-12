import { IProfession } from 'app/shared/model/profession.model';
import { ICandidate } from 'app/shared/model/candidate.model';
import { IUser } from 'app/shared/model/user.model';

export interface IAdvertisement {
  id?: number;
  description?: string;
  active?: boolean;
  title?: string;
  profession?: IProfession;
  candidates?: ICandidate[];
  user?: IUser;
}

export const defaultValue: Readonly<IAdvertisement> = {
  active: false
};
