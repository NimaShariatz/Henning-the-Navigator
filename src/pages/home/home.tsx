import "./home.css"
import { Henning_logo} from "../../static/constants.tsx"
import { Link } from "react-router-dom"

function Home(){
    return(
        <div className="home_container">


            <div className='logo_container'>
                <img className='logo' src={Henning_logo} alt="Henning the Navigator Logo"/>
            </div>

            <div className="home_start_container">

                <Link to="/map">Navigate</Link>

            </div>





            <div className="home_background_img_1 img1">
                <div className="content_container">

                </div>

            </div>
            <div className="home_background_img_2 img2"></div>

            
            <div className="home_background_img_3 img3"></div>
            <div className="home_background_img_4 img4"></div>
            <div className="home_background_img_5 img5"></div>
            <div className="home_background_img_6 img6"></div>
            <div className="home_background_img_7 img7"></div>
            







        {/*
            1 - video
            2 - navigation
            3 - misc
            4 - target
            5 - drawing on map
            6 - map selection
            7 - manual 10km distance setter

        */}


        </div>
    )
}
export default Home