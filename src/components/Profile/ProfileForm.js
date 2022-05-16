import classes from './ProfileForm.module.css';
import { useRef,useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';
const ProfileForm = () => {

  const newPasswordInputRef=useRef();
  const history=useHistory();
  const authCtx=useContext(AuthContext)
  const submitHandler=(event)=>{
    event.preventDefault();
    const enteredNewPassword=newPasswordInputRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyABbjkeWD-vUx1J1jeB8Yx4xkLzpn50TNo',{
      method:'POST',
      body:JSON.stringify({
        idToken: authCtx.token,
        password:enteredNewPassword,
        returnSecureToken:false
      }),
      'Content-type':'application/json',
      'Authorization': 'Bearer abc'
    }).then(res=>{
      history.replace('/')


    })
  }
  return (
    <form onSubmit={submitHandler}className={classes.form}>

      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength='7' ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
