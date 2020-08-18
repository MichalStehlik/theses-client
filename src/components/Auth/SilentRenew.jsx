import React from "react";
import {Redirect} from "react-router";
import {useAppContext} from "../../providers/ApplicationProvider";

const SilentRenew = props => {
    const [{userManager}] = useAppContext();
    userManager.signinSilentCallback();
    return <Redirect to="/" />;
}
   
export default SilentRenew;