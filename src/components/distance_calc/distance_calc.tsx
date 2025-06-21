
import "./distance_calc.css"
/*
 Info:
 first the image sizes are set up. The width and height of our image is gotten.
 Then the canvas is set up with that information 
 
 */

function Distance_calc() {

    return(
        <>
            <div className="distance_setter">
                <form>

                    <input type="number" id="distance_input" name="distance_input"></input>
                    
                </form>
            </div>

        </>
    )

}export default Distance_calc