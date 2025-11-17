import React from "react";
import { useAuthContext } from "@context/AuthContext";
import { usePostContext } from "@context/PostContext"; 

export const FeedBack = () => {
    const {isSkSuperAdmin, isSkNaturalAdmin} = useAuthContext();
    const canManage = isSkNaturalAdmin || isSkNaturalAdmin;
    const {post, isLooading} = usePostContext();


    return(
        <section>
{canManage && ""}
{isLooading ? (
    <p>Laoding feedback form...</p>
) : (

)}

        </section>

    );

}