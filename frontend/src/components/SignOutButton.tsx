import { useMutation, useQueryClient } from "react-query"
import {useAppContext } from "../context/AppContext"
import * as apiClient from '../api-client'

const SignOutButton = () =>{
    const queryClient = useQueryClient()
    const {showToast} = useAppContext()

    const mutation = useMutation(apiClient.signOut , {
        onSuccess: async () =>{
            await queryClient.invalidateQueries("validateToken")
            showToast({message:"Sign out successful!" , type:"SUCCESS"})
        },
        onError: (error : Error) =>
        showToast({message:error.message , type:"ERROR"})
    })

    const onButtonClick = () => {
        mutation.mutate()
    }
    

    return (
        <button className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100" onClick={onButtonClick}>Sign Out</button>
    )}

export default SignOutButton
