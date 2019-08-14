import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IAdvertisement, defaultValue } from 'app/shared/model/advertisement.model';

export const ACTION_TYPES = {
  FETCH_ADVERTISEMENT_LIST: 'advertisement/FETCH_ADVERTISEMENT_LIST',
  FETCH_ADVERTISEMENT: 'advertisement/FETCH_ADVERTISEMENT',
  CREATE_ADVERTISEMENT: 'advertisement/CREATE_ADVERTISEMENT',
  UPDATE_ADVERTISEMENT: 'advertisement/UPDATE_ADVERTISEMENT',
  DELETE_ADVERTISEMENT: 'advertisement/DELETE_ADVERTISEMENT',
  RESET: 'advertisement/RESET',
  FETCH_ALL_ACTIVE_ADVERTISEMENT_LIST: 'advertisement/FETCH_ALL_ACTIVE_ADVERTISEMENT_LIST',
  FETCH_ADVERTISEMENT_BY_PROFESSION: 'advertisement/FETCH_ADVERTISEMENT_BY_PROFESSION'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAdvertisement>,
  activeEntitiesCount: 0,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  allActiveEntities: [] as ReadonlyArray<IAdvertisement>,
  entitiesByProfession: [] as ReadonlyArray<{ professionName: string; adsCount: number }>
};

export type AdvertisementState = Readonly<typeof initialState>;

// Reducer

export default (state: AdvertisementState = initialState, action): AdvertisementState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ADVERTISEMENT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_ADVERTISEMENT):
    case REQUEST(ACTION_TYPES.FETCH_ALL_ACTIVE_ADVERTISEMENT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_ADVERTISEMENT_BY_PROFESSION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_ADVERTISEMENT):
    case REQUEST(ACTION_TYPES.UPDATE_ADVERTISEMENT):
    case REQUEST(ACTION_TYPES.DELETE_ADVERTISEMENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_ADVERTISEMENT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_ADVERTISEMENT):
    case FAILURE(ACTION_TYPES.FETCH_ALL_ACTIVE_ADVERTISEMENT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_ADVERTISEMENT_BY_PROFESSION):
    case FAILURE(ACTION_TYPES.CREATE_ADVERTISEMENT):
    case FAILURE(ACTION_TYPES.UPDATE_ADVERTISEMENT):
    case FAILURE(ACTION_TYPES.DELETE_ADVERTISEMENT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_ADVERTISEMENT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
        activeEntitiesCount: parseInt(action.payload.headers['x-active-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_ADVERTISEMENT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_ALL_ACTIVE_ADVERTISEMENT_LIST):
      return {
        ...state,
        loading: false,
        allActiveEntities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_ADVERTISEMENT_BY_PROFESSION):
      return {
        ...state,
        loading: false,
        entitiesByProfession: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_ADVERTISEMENT):
    case SUCCESS(ACTION_TYPES.UPDATE_ADVERTISEMENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_ADVERTISEMENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/advertisements';

// Actions

export const getEntities: ICrudGetAllAction<IAdvertisement> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_ADVERTISEMENT_LIST,
    payload: axios.get<IAdvertisement>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getActiveEntities: ICrudGetAllAction<IAdvertisement> = () => ({
  type: ACTION_TYPES.FETCH_ALL_ACTIVE_ADVERTISEMENT_LIST,
  payload: axios.get<IAdvertisement>(`${apiUrl}/active?cacheBuster=${new Date().getTime()}`)
});

export const getEntitiesByProfession: ICrudGetAllAction<IAdvertisement> = () => ({
  type: ACTION_TYPES.FETCH_ADVERTISEMENT_BY_PROFESSION,
  payload: axios.get<IAdvertisement>(`${apiUrl}/active/by-profession?cacheBuster=${new Date().getTime()}`)
});

export const getEntitiesByProfessionByCurrentUser: ICrudGetAllAction<IAdvertisement> = () => ({
  type: ACTION_TYPES.FETCH_ADVERTISEMENT_BY_PROFESSION,
  payload: axios.get<IAdvertisement>(`${apiUrl}/active/by-profession/by-user?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IAdvertisement> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_ADVERTISEMENT,
    payload: axios.get<IAdvertisement>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IAdvertisement> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_ADVERTISEMENT,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const updateEntity: ICrudPutAction<IAdvertisement> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ADVERTISEMENT,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAdvertisement> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_ADVERTISEMENT,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
