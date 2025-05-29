import PageAnimate from "../../components/Animate/PageAnimate";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import logo from "../../assets/IndiaBills_logo.png";
import bg from "../../assets/bglogo.png";
import { InputAdornment } from "@mui/material";
import { apiLogin } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

const quotes = [
  "The best way to get started is to quit talking and begin doing.",
  "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.",
  "Don’t let yesterday take up too much of today.",
  "You learn more from failure than from success. Don’t let it stop you. Failure builds character.",
  "It’s not whether you get knocked down, it’s whether you get up.",
];

const LoginPage = () => {
  const [quote, setQuote] = useState("");

  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [data, setData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (localStorage.getItem("session")) {
      console.log("Session already exists");
      navigate("/");
      return;
    } else {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
    }
  }, []);

  const HandleLogin = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      errorPopup("Don't leave the credentials empty!");
      return;
    }

    const response = await apiLogin({
      email: data.email,
      password: data.password,
    });

    if (response.status !== 200) {
      switch (response.status) {
        case 404:
          errorPopup("User or password incorrect");
          return;
        case 500:
          errorPopup("Something went wrong");
          return;
      }
    }

    const session = response.data;
    const payload = {
      id: session.user.id,
      name: session.user.name,
      role: session.user.role.toLocaleLowerCase(),
      avatar: session.avatar,
      token: session.token,
    };
    login(payload);
    navigate("/");
  };

  return (
    <div style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100dvh",
        width: "100%",
        position: "fixed",
        inset: 0,
      }}
      className={"grid place-items-center justify-center"}
    >
        <form onSubmit={HandleLogin} className="px-20 py-12 flex flex-col gap-12 w-[27rem] items-center bg-slate-800 bg-opacity-75 border border-slate-500 rounded-lg shadow-lg">
          <div className={"flex flex-col gap-4 items-center text-center"}>
            <img src={logo} alt="logo" className="w-52 hover:brightness-200" />
            <p className={"text-slate-400 font-light opacity-75"}> {quote} </p>
          </div>

          <div className="flex flex-col gap-8">
          <TextField
          label={"Email"}
          name={"email"}
          type={"email"}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px', // Rounded borders
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            },
          }}
          onChange={(e) => setData({ ...data, ["email"]: e.target.value })}
          placeholder={"example@address.com"}
          value={data.email}
        />

  <TextField
    label={"Password"}
    name={"password"}
    type={showPassword ? "text" : "password"}
    onChange={(e) => setData({ ...data, ["password"]: e.target.value })}
    placeholder={"******"}
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: '16px',
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.2)',
        '&.Mui-focused fieldset': {
          borderColor: 'white',
        },
      },
      '& .MuiInputLabel-root': {
        color: 'white',
      },
    }}
    value={data.password}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
          </div>

          <input value={'Login'} type="submit" className="bg-rose-600 w-full rounded-xl p-2 text-slate-300 shadow-xl transition hover:shadow-none cursor-pointer hover:bg-rose-700" />
        </form>
    </div>
  );
};

export default LoginPage;
