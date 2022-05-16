import { useState, useRef,useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

import classes from './AuthForm.module.css';

 

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx=useContext(AuthContext)
  const history=useHistory();

  const emailInputRef=useRef();
  const passwordInputRef=useRef();
  

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const submitHandler=(event)=>{
    event.preventDefault();
    const enteredEmail=emailInputRef.current.value;
    const enteredPassword=passwordInputRef.current.value;
    setIsLoading(true);
    let url;
    if(isLogin)
    {
      url='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyABbjkeWD-vUx1J1jeB8Yx4xkLzpn50TNo';

    }
    else{
      url='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyABbjkeWD-vUx1J1jeB8Yx4xkLzpn50TNo';
    }
    fetch(url,{
      method:'POST',
      body:JSON.stringify({
        email:enteredEmail,
        password:enteredPassword,
        returnSecureToken:true
      }),
      headers:{
      'Content-Type': 'application/json'
      }

      
    }).then(res=>{
      setIsLoading(false);
      if(res.ok)
      {
        return res.json();
      }else{
        return res.json().then((data)=>{
        const errorMessage = 'Authentication Failed';
        console.log(data)
        //alert(errorMessage);
        throw new Error(errorMessage);
        })
      }

    }).then((data)=>{
      const expirationTime=new Date((new Date().getTime()+ (+data.expiresIn*1000)));
      authCtx.login(data.idToken,expirationTime.toISOString())
      history.replace('/')
    }).catch((err)=>{
      alert(err.message)
    })
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef}/>
        </div>
        <div className={classes.actions}>
     {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
     {isLoading && <p>Loading............</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
