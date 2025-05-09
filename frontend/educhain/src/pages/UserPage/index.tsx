import type { FunctionComponent } from "react";
import { useParams } from "react-router";

interface UserPageProps {
    
}
 
const UserPage: FunctionComponent<UserPageProps> = () => {
    let params = useParams();
    console.log(params);
    

    return ( 
        <>
            UserPage - {params.address}
        </>
     );
}
 
export default UserPage;