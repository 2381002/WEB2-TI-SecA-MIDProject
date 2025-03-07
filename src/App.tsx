import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
  import RootLayout from "./layouts/RootLayout";
  import Comments from "./pages/Comments";
  import CommentsDetail from "./pages/CommentsDetail";
  import EditComments from "./pages/EditComments";
  import Todos from "./pages/Todos";
  import TodosDetail from "./pages/TodosDetail";
  import EditTodos from "./pages/EditTodos";
  import Post from "./pages/Post";
  import Product from "./pages/Product";
  import Recipes from "./pages/Recipes";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import ProductDetail from "./pages/ProductDetail";
  import EditProduct from "./pages/EditProduct";
  import Home from "./pages/Home";
  import RecipesDetail from "./pages/RecipesDetail";
  import EditRecipes from "./pages/EditRecipes";
  import PostDetail from "./pages/PostDetail";
  import EditPost from "./pages/EditPost";
  import ErrorPage from "./components/ErrorPage";
  
  const queryClient = new QueryClient();
  
  function App() {
	const router = createBrowserRouter(
	  createRoutesFromElements(
		<Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
		  <Route index element={<Home />} />
		  <Route path="home" element={<Home />} errorElement={<ErrorPage />} />
		  <Route path="product" element={<Product />} errorElement={<ErrorPage />} />
		  <Route path="product/:id" element={<ProductDetail />} errorElement={<ErrorPage />} />
		  <Route path="product/edit/:id" element={<EditProduct />} errorElement={<ErrorPage />} />
		  <Route path="recipes" element={<Recipes />} errorElement={<ErrorPage />} />
		  <Route path="recipes/:id" element={<RecipesDetail />} errorElement={<ErrorPage />} />
		  <Route path="recipes/edit/:id" element={<EditRecipes />} errorElement={<ErrorPage />} />
		  <Route path="posts" element={<Post />} errorElement={<ErrorPage />} />
		  <Route path="posts/:id" element={<PostDetail />} errorElement={<ErrorPage />} />
		  <Route path="posts/edit/:id" element={<EditPost />} errorElement={<ErrorPage />} />
		  <Route path="comments" element={<Comments />} errorElement={<ErrorPage />} />
		  <Route path="comments/:id" element={<CommentsDetail />} errorElement={<ErrorPage />} />
		  <Route path="comments/edit/:id" element={<EditComments />} errorElement={<ErrorPage />} />
		  <Route path="todos" element={<Todos />} errorElement={<ErrorPage />} />
		  <Route path="todos/:id" element={<TodosDetail />} errorElement={<ErrorPage />} />
		  <Route path="todos/edit/:id" element={<EditTodos />} errorElement={<ErrorPage />} />
		  <Route path="*" element={<ErrorPage />} />
		</Route>
	  )
	);
  
	return (
	  <QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	  </QueryClientProvider>

	);
}
  
export default App;  