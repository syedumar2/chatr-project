import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <><h3>Home</h3>
    <Button><Link to="/signin">Login</Link></Button>
    <Button><Link to="/signup">Register</Link></Button>
    
    </>
  )
}

export default Home