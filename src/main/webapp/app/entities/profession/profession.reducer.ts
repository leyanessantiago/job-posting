import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProfession, defaultValue } from 'app/shared/model/profession.model';

export const ACTION_TYPES = {
  FETCH_PROFESSION_LIST: 'profession/FETCH_PROFESSION_LIST',
  FETCH_PROFESSION: 'profession/FETCH_PROFESSION',
  CREATE_PROFESSION: 'profession/CREATE_PROFESSION',
  UPDATE_PROFESSION: 'profession/UPDATE_PROFESSION',
  DELETE_PROFESSION: 'profession/DELETE_PROFESSION',
  RESET: 'profession/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProfession>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type ProfessionState = Readonly<typeof initialState>;

// Reducer

export default (state: ProfessionState = initialState, action): ProfessionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROFESSION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROFESSION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_PROFESSION):
    case REQUEST(ACTION_TYPES.UPDATE_PROFESSION):
    case REQUEST(ACTION_TYPES.DELETE_PROFESSION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_PROFESSION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROFESSION):
    case FAILURE(ACTION_TYPES.CREATE_PROFESSION):
    case FAILURE(ACTION_TYPES.UPDATE_PROFESSION):
    case FAILURE(ACTION_TYPES.DELETE_PROFESSION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROFESSION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROFESSION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROFESSION):
    case SUCCESS(ACTION_TYPES.UPDATE_PROFESSION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROFESSION):
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

const apiUrl = 'api/professions';

// Actions

export const getEntities: ICrudGetAllAction<IProfession> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROFESSION_LIST,
    payload: axios.get<IProfession>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IProfession> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROFESSION,
    payload: axios.get<IProfession>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IProfession> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROFESSION,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProfession> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROFESSION,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProfession> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROFESSION,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
