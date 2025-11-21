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
                            <span className="tooltip_text">A selection of default map choices. Any map change will remove existing waypoints, target points, and drawings from the map.</span>
                        </div>

                        
                        <div className="home_numberSetter tooltip_needed">
                            <p>392</p>
                            <span className="tooltip_text">A number representing a 10 x 10km distance. You can set your own representative number by lining up the rectangle with a square box in your map.</span>
                        </div>

                        <div className="home_icon tooltip_needed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="60%" viewBox="0 0 48 48">
                                <g fill="none">
                                    <path className="map_upload_fill" d="M44 24a2 2 0 1 0-4 0zM24 8a2 2 0 1 0 0-4zm15 32H9v4h30zM8 39V9H4v30zm32-15v15h4V24zM9 8h15V4H9zm0 32a1 1 0 0 1-1-1H4a5 5 0 0 0 5 5zm30 4a5 5 0 0 0 5-5h-4a1 1 0 0 1-1 1zM8 9a1 1 0 0 1 1-1V4a5 5 0 0 0-5 5z" />
                                    <path className="map_upload_stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="m6 35l10.693-9.802a2 2 0 0 1 2.653-.044L32 36m-4-5l4.773-4.773a2 2 0 0 1 2.615-.186L42 31m-5-13V6m-5 5l5-5l5 5" />
                                </g>
                            </svg>
                            <span className="tooltip_text">You can upload your own map for navigation. Remember to set your 10 x 10km distance. Any map change will remove existing waypoints, target points, and drawings from the map.</span>
                        </div>

                    </div>
                </div>










                <div className="home_info_sect">
                    <p className="home_info_sect_title">Navigation</p>

                    <div className="home_help_sect">
                        
                        <div className="home_icon_row">    
                            <div className="home_icon tooltip_needed">
                                <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                                    <defs>
                                        <mask id="home-point-start">
                                            <g fill="none">
                                                <path stroke="#ffffff" strokeLinecap="round" strokeOpacity="1" d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5" />
                                                <path fill="#fff" fillOpacity="0.25" d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0" />
                                                <circle cx="12" cy="10" r="3" fillOpacity="0.85" fill="#fff" />
                                            </g>
                                        </mask>
                                    </defs>
                                    <path className="start_fill" d="M0 0h24v24H0z" mask="url(#home-point-start)" />
                                </svg>
                                <span className="tooltip_text">The starting location of your flight.</span>
                            </div>
                            <div className="home_icon tooltip_needed">
                                <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                                    <defs>
                                        <mask id="home-point-target">
                                            <g fill="none">
                                                <path stroke="#ffffff" strokeLinecap="round" strokeOpacity="1" d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5" />
                                                <path fill="#fff" fillOpacity="0.25" d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0" />
                                                <circle cx="12" cy="10" r="3" fillOpacity="0.85" fill="#fff" />
                                            </g>
                                        </mask>
                                    </defs>
                                    <path className="target_fill" d="M0 0h24v24H0z" mask="url(#home-point-target)" />
                                </svg>
                                <span className="tooltip_text">The target location of your flight.</span>
                            </div>
                            <div className="home_icon tooltip_needed">
                                <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                                    <defs>
                                        <mask id="home-point-navigation">
                                            <g fill="none">
                                                <path stroke="#ffffff" strokeLinecap="round" strokeOpacity="1" d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5" />
                                                <path fill="#fff" fillOpacity="0.25" d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0" />
                                                <circle cx="12" cy="10" r="3" fillOpacity="0.85" fill="#fff" />
                                            </g>
                                        </mask>
                                    </defs>
                                    <path className="navigation_fill" d="M0 0h24v24H0z" mask="url(#home-point-navigation)" />
                                </svg>
                                <span className="tooltip_text">The waypoints that are between your starting and target location.</span>
                            </div>
                            <div className="home_icon tooltip_needed">
                                <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                                    <defs>
                                        <mask id="home-point-extraction">
                                            <g fill="none">
                                                <path stroke="#ffffff" strokeLinecap="round" strokeOpacity="1" d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5" />
                                                <path fill="#fff" fillOpacity="0.25" d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0" />
                                                <circle cx="12" cy="10" r="3" fillOpacity="0.85" fill="#fff" />
                                            </g>
                                        </mask>
                                    </defs>
                                    <path className="extraction_fill" d="M0 0h24v24H0z" mask="url(#home-point-extraction)" />
                                </svg>
                                <span className="tooltip_text">The waypoints that come after your target location, otherwise known as 'egress'.</span>
                            </div>
                        </div>


                        <div className="home_icon tooltip_needed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="65%" height="65%" viewBox="0 0 24 24">
                                <g fill="none" fillRule="evenodd">
                                    <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                                    <path className="clear_fill" d="M17.278 2.613a1 1 0 0 1 1.89.643l-.038.11l-2.61 6.42l.657.175c1.05.281 1.924 1.134 2.09 2.298c.142 1 .275 2.52.092 4.086c-.182 1.552-.69 3.278-1.947 4.546c-.462.466-1.125.54-1.573.548c-.511.008-1.1-.07-1.705-.19c-1.216-.242-2.674-.69-4.054-1.166l-.414-.145l-.813-.294l-.78-.291l-.734-.283l-.978-.388l-.822-.335l-.817-.345a1 1 0 0 1-.228-1.708c1.377-1.08 2.67-2.322 3.761-3.469l.529-.564l.25-.274l.472-.527l.22-.252l.594-.695l.337-.406a3.1 3.1 0 0 1 2.981-1.087l.199.046l.737.197zM10.5 13.348a44 44 0 0 1-3.479 3.444q.863.349 1.733.68a7.3 7.3 0 0 0 1.426-1.338a7 7 0 0 0 .488-.654l.142-.232a1 1 0 0 1 1.747.973c-.234.42-.527.814-.832 1.184a10 10 0 0 1-.792.856c.462.158.924.308 1.372.446c.373-.257.81-.785 1.206-1.385q.239-.36.452-.74l.204-.384a1 1 0 0 1 1.793.887c-.229.462-.496.909-.78 1.339a11 11 0 0 1-.634.868l.421.082c.362.067.744.114 1.089.043c.766-.815 1.163-1.998 1.316-3.305q.053-.456.068-.904zm2.819-2.35a1.09 1.09 0 0 0-1.116.378l-.243.293l5.398 1.446l-.047-.392l-.024-.182c-.037-.253-.216-.491-.511-.61l-.116-.038zM5.565 7.716l.064.14A3.26 3.26 0 0 0 6.866 9.22l.1.058a.068.068 0 0 1 0 .118l-.1.058A3.26 3.26 0 0 0 5.63 10.82l-.064.139a.071.071 0 0 1-.13 0l-.064-.14a3.26 3.26 0 0 0-1.237-1.364l-.1-.058a.068.068 0 0 1 0-.118l.1-.058A3.26 3.26 0 0 0 5.37 7.855l.064-.139a.071.071 0 0 1 .13 0Zm2.832-4.859c.04-.09.166-.09.206 0l.102.222a5.2 5.2 0 0 0 1.97 2.171l.157.093a.108.108 0 0 1 0 .189l-.158.092a5.2 5.2 0 0 0-1.97 2.172l-.1.222a.113.113 0 0 1-.207 0l-.102-.222a5.2 5.2 0 0 0-1.97-2.172l-.158-.092a.108.108 0 0 1 0-.189l.159-.093a5.2 5.2 0 0 0 1.97-2.171l.1-.222Z" />
                                </g>
                            </svg>
                            <span className="tooltip_text">This will clear all points and drawings from the map.</span>
                        </div>


                        <div className="home_icon tooltip_needed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="65%" height="65%" viewBox="0 0 24 24">
                                <g fill="none">
                                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                    <path className="info_fill" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m-.01 6c.558 0 1.01.452 1.01 1.01v5.124A1 1 0 0 1 12.5 18h-.49A1.01 1.01 0 0 1 11 16.99V12a1 1 0 1 1 0-2zM12 7a1 1 0 1 1 0 2a1 1 0 0 1 0-2" />
                                </g>
                            </svg>
                            <span className="tooltip_text">The information panel contains distances, headings, flight notes, the target picture, and basic calculators.</span>
                        </div>


                    </div>
                </div>












                <div className="home_info_sect">
                    <p className="home_info_sect_title">File Sharing</p>

                    <div className="home_help_sect">
     
                        <div className="home_icon tooltip_needed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="65%" height="65%" viewBox="0 0 24 24">
                                <path className="download_fill" d="M12 15.575q-.2 0-.375-.062T11.3 15.3l-3.6-3.6q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L11 12.15V5q0-.425.288-.712T12 4t.713.288T13 5v7.15l1.875-1.875q.3-.3.713-.288t.712.313q.275.3.288.7t-.288.7l-3.6 3.6q-.15.15-.325.213t-.375.062M6 20q-.825 0-1.412-.587T4 18v-2q0-.425.288-.712T5 15t.713.288T6 16v2h12v-2q0-.425.288-.712T19 15t.713.288T20 16v2q0 .825-.587 1.413T18 20z" />
                            </svg>
                            <span className="tooltip_text">A "JSON" file is downloaded. The download will include all waypoints, target points, flight notes, and drawings both on the map and on the target picture. Images are not included.</span>
                        </div>


                        <div className="home_icon tooltip_needed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="65%" height="65%" viewBox="0 0 28 28">
                                <path className="folder_fill" d="M2 6.75A3.75 3.75 0 0 1 5.75 3h3.672c.729 0 1.428.29 1.944.805L13.25 5.69l-2.944 2.945A1.25 1.25 0 0 1 9.422 9H2zm.004 3.75v9.75A3.75 3.75 0 0 0 5.754 24H22.25A3.75 3.75 0 0 0 26 20.25V9.75A3.75 3.75 0 0 0 22.25 6h-7.19l-3.694 3.695a2.75 2.75 0 0 1-1.944.805z" />
                            </svg>
                            <span className="tooltip_text">The upload will include waypoints, target points, flight notes, and drawings both on the map and target picture. Remember to select your map prior to the upload.</span>
                        </div>

                    </div>
                </div>

                <div className="home_info_sect">
                    <p className="home_info_sect_title">Drawing</p>

                    <div className="home_help_sect">
     
                        <div className="home_drawing_row tooltip_needed">

                            <div className="home_mapdraw_thickness_container">
                                <button className="home_left_increment">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20">
                                        <g fillRule="evenodd" clipRule="evenodd">
                                            <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
                                            <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
                                        </g>
                                    </svg>
                                </button>

                                <p>10</p>


                                <button className="home_right_increment">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20">
                                        <g fillRule="evenodd" clipRule="evenodd">
                                            <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
                                            <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
                                        </g>
                                    </svg>
                                </button>


                                <div className="home_drawCircle"></div>
                            </div>

                            <span className="tooltip_text">When the color selector circle is selected, drawing mode is enabled. You may change the thickness, opacity, and color of your drawings in addition to erasing them. Changing thickness only applies to drawings on the map, not the target picture.</span>

                        </div>





                        <div className="home_drawing_row tooltip_needed">

                            <div className="home_erase_and_text_container">

                                <button className="home_drawEraser">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path fill="var(--logo_yellow)" d="M14.952 3c-1.037 0-1.872.835-3.542 2.505l-4.91 4.91l7.085 7.085l4.91-4.91C20.165 10.92 21 10.085 21 9.048c0-1.038-.835-1.873-2.505-3.543S15.99 3 14.952 3" opacity="0.5" />
                                        <path fill="var(--logo_yellow)" d="M13.585 17.5L6.5 10.415l-.995.995C3.835 13.08 3 13.915 3 14.952c0 1.038.835 1.873 2.505 3.543S8.01 21 9.048 21c1.037 0 1.872-.835 3.542-2.505z" />
                                        <path fill="var(--logo_yellow)" d="M9.033 21H9zm.03 0c.796-.006 1.476-.506 2.51-1.5H21a.75.75 0 0 1 0 1.5z" opacity="0.5" />
                                    </svg>
                                </button>

                                <button className="home_comment">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={"80%"} height={"80%"} viewBox="0 0 24 24">
                                        <g fill="var(--background_1)">
                                            <path fill="var(--logo_yellow)" fillOpacity="0.16" d="M19 16h-2.525a.99.99 0 0 0-.775.375l-2.925 3.65a1 1 0 0 1-1.562 0l-2.925-3.65A.99.99 0 0 0 7.512 16H5c-1.662 0-3-1.338-3-3V6c0-1.662 1.338-3 3-3h14c1.663 0 3 1.338 3 3v7c0 1.662-1.337 3-3 3" />
                                            <path stroke="var(--logo_yellow)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M8 8h8m-8 3h8m3 5h-2.525a.99.99 0 0 0-.775.375l-2.925 3.65a1 1 0 0 1-1.562 0l-2.925-3.65A.99.99 0 0 0 7.512 16H5c-1.662 0-3-1.338-3-3V6c0-1.662 1.338-3 3-3h14c1.663 0 3 1.338 3 3v7c0 1.662-1.337 3-3 3" />
                                        </g>
                                    </svg>
                                </button>




                                
                            </div>

                            <span className="tooltip_text">The eraser applies to drawings on the map and on the target picture inside the information panel. You may add comments to the map as well which appear on cursor hover.</span>

                        </div>










                    </div>

                    
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