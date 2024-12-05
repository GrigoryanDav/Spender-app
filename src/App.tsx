import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './constants/routes';
import { useSelector } from 'react-redux';
import { RootState } from './ts/interfaces/rootState';
import { fetchUserProfileInfo } from './state-managment/slices/userProfile';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch } from './state-managment/store';
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from './components/layouts/Main';
import CabinetLayout from './components/layouts/Cabinet';
import Cabinet from './pages/Cabinet';
import './styles/global.css'

function App() {
  const { loading, authUserInfo: { isAuth } } = useSelector((store: RootState) => store.userProfile)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchUserProfileInfo())
  }, [dispatch])

  return (
    <div className="App">
      <RouterProvider
        router={
          createBrowserRouter(
            createRoutesFromElements(
              <Route path={ROUTES.HOME} element={<MainLayout />}>
                <Route path={ROUTES.LOGIN} element={ isAuth ? <Navigate to={ROUTES.CABINET}/> : <Login />} />
                <Route path={ROUTES.REGISTER} element={ isAuth ? <Navigate to={ROUTES.CABINET}/> : <Register />} />
                <Route path={ROUTES.CABINET} element={ isAuth ? <CabinetLayout /> : <Navigate to={ROUTES.LOGIN}/>}>
                  <Route path={ROUTES.CABINET} element={<Cabinet />} />
                </Route>
              </Route>
            )
          )
        }
      />
    </div>
  );
}

export default App;
