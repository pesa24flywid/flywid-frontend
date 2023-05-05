import Global from "../../../lib/models/Global";
import Connect from "../../../lib/utils/mongoose";

export default async function handler(req, res){
    try {
        await Connect()
        const result = await Global.find({organisation_code: process.env.NEXT_PUBLIC_ORGANISATION})
        if(!result){
            return res.status(404).json({message: 'Not Found!'})
        }
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error})
    }
}