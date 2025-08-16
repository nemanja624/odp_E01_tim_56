import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Courses from "../pages/Courses";
import CourseDetails from "../pages/CourseDetails";
import NotFound from "../pages/NotFound";
export const router = createBrowserRouter([
  { path: "/", element: <Courses/> },
  { path: "/login", element: <Login/> },
  { path: "/register", element: <Register/> },
  { path: "/courses/:id", element: <CourseDetails/> },
  { path: "*", element: <NotFound/> }
]);
