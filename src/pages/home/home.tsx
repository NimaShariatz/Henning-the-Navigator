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

            <div className="home_content_container">
                <div className="home_info_sect">
                    <p className="home_info_sect_title">Map</p>

                    <div className="home_help_sect">
                        
                        <div className="home_mapSelect_sect tooltip_needed">
                            <p>Stalingrad</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1vw" height="1vw" viewBox="0 0 16 16">
                                <path fill="var(--logo_yellow)" d="M9.312 14.223a1.5 1.5 0 0 1-2.629 0l-5.5-10a1.5 1.5 0 0 1 1.315-2.222h10.999a1.5 1.5 0 0 1 1.314 2.223z" />
                            </svg>
                            <span className="tooltip_text">A selection of default map choices</span>
                        </div>

                        
                        <div className="home_numberSetter tooltip_needed">
                            <p>392</p>
                            <span className="tooltip_text">A number representing a 10 x 10km distance. You can set your own representative number by lining up the rectangle with a box.</span>
                        </div>

                        <div className="home_icon tooltip_needed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="65%" height="65%" viewBox="0 0 24 24">
                                <path className="map_upload_fill" d="m5 18.31l3-1.16V5.45L5 6.46zm11 .24l3-1.01V5.69l-3 1.17z" opacity="0.3" />
                                <path className="map_upload_fill" d="m20.5 3l-.16.03L15 5.1L9 3L3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1l5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5M8 17.15l-3 1.16V6.46l3-1.01zm6 1.38l-4-1.4V5.47l4 1.4zm5-.99l-3 1.01V6.86l3-1.16z" />
                            </svg>
                            <span className="tooltip_text">You can upload your own map for navigation. Remember to set your 10 x 10km distance.</span>

                        </div>




                    </div>


                </div>

                <div className="home_info_sect">
                    Navigation
                </div>


                <div className="home_info_sect">
                    File Sharing
                </div>

                <div className="home_info_sect">
                    Drawing
                </div>
                

            </div>





            <div className="home_background_img_1 img1"></div>
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