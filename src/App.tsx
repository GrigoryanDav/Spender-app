import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { ROUTES } from './constants/routes';
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from './components/layouts/Main';
import './styles/global.css'

function App() {
  return (
    <div className="App">
      <RouterProvider
        router={
          createBrowserRouter(
            createRoutesFromElements(
              <Route path={ROUTES.HOME} element={<MainLayout />}>
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
              </Route>
            )
          )
        }
      />
    </div>
  );
}

export default App;
