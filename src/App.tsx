import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { ROUTES } from './constants/routes';
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <div className="App">
      <RouterProvider
        router={
          createBrowserRouter(
            createRoutesFromElements(
              <Route path={ROUTES.HOME}>
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
