import {API} from 'config';
import {ReLogin} from 'reducer/account/auth';

const CreateProfileReq = () => {
  return async (dispatch) => {
    const {relogin} = await dispatch(ReLogin());
    if (relogin) {
      return {
        err: 'Need to reauthenticate',
      };
    }
    try {
      const response = await fetch(API.profile.new, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        //TODO: change to same-origin
        credentials: 'include',
        body: JSON.stringify({}),
      });
      const status = response.status;
      if (status < 200 || status >= 300) {
        const data = await response.json();
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Could not create profile');
        }
      }
      return {
        err: false,
      };
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

const EditProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(API.profile.image, {
    method: 'PUT',
    //TODO: change to same-origin
    credentials: 'include',
    body: formData,
  });
  const status = response.status;
  if (status < 200 || status >= 300) {
    const data = await response.json();
    if (data && data.message) {
      throw new Error(data.message);
    } else {
      throw new Error('Could not update image');
    }
  }
};

const EditProfileReq = (options) => {
  return async (dispatch) => {
    const {relogin} = await dispatch(ReLogin());
    if (relogin) {
      return {
        err: 'Need to reauthenticate',
      };
    }
    try {
      const textoptions = Object.assign({}, options, {image: undefined});
      const response = await fetch(API.profile.edit, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        //TODO: change to same-origin
        credentials: 'include',
        body: JSON.stringify(textoptions),
      });
      const status = response.status;
      if (status < 200 || status >= 300) {
        const data = await response.json();
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Could not edit profile');
        }
      }

      if (options.image) {
        await EditProfileImage(options.image);
      }

      return {
        err: false,
      };
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

const GetProfileReq = () => {
  return async (dispatch) => {
    const {relogin} = await dispatch(ReLogin());
    if (relogin) {
      return {
        err: 'Need to reauthenticate',
        canCreate: false,
      };
    }
    try {
      const response = await fetch(API.profile.get, {
        method: 'GET',
        //TODO: change to same-origin
        credentials: 'include',
      });
      const status = response.status;
      const data = await response.json();
      if (status < 200 || status >= 300) {
        if (data && data.code === 2) {
          return {
            err: data.message,
            canCreate: true,
          };
        }
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Could not get profile');
        }
      }
      return {
        err: false,
        canCreate: false,
        data: data,
      };
    } catch (e) {
      return {
        err: e.message,
        canCreate: false,
      };
    }
  };
};

export {CreateProfileReq, EditProfileReq, GetProfileReq};
