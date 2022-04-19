import cors from 'cors';
import express from 'express'

export class Cors{
    public static enable(app: express.Application) : void {
        const whiteList = process.env.CORS_DOMAIN!.split(",")

        const corsOption = {
            origin: function(origin, callback){
                if(!origin || whiteList!.indexOf(origin) != -1){
                    callback(null, true)
                }else{
                    callback(new Error("Not allowed by CORS"))
                }
            }
        }
        
        app.use(cors(corsOption))
        app.options("*", cors())
    }
}