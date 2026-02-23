import { useAuth } from "../AuthContext"

const Profile = () => {
    const {currentUser} = useAuth();
  return (
    <div className="p-4 mt-16 align-center">
        <h1 className="font-bold">Profile Details</h1>
        <div>
            <p>Name: {currentUser?.displyName || 'Not Provided'}</p>
            <p>Email: {currentUser?.email || 'Unable to get'}</p>
            <p>Id: {currentUser?.uid || 'Unable to get'}</p>
        </div>
    </div>
  )
}

export default Profile