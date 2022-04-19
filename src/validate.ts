import { Request, Response } from "express";
import { validate } from "class-validator";

export class Validator{
    public valiadte<T extends object>(objType: new() => T) {
        return(req: Request, res: Response, next) => {

            const newObj = this.createInstanceFromJson(objType, {...req.body})
            newObj['image'] = req.file.filename

            validate(newObj).then((err) => {
                if(err.length){
                    const _error = err[0].constraints
                    const [first] = Object.keys(_error)
                    const error = _error[first]

                    return res.status(400).json({
                        "message": error
                    })
                }
                req.dto = newObj

                next()
            })

        }
    }

    public createInstanceFromJson<T>(objType: new() => T, json:any){
        const newObj = new objType()

        for(const ppty in json){
            newObj[ppty] = json[ppty]
        }

        return newObj
    }
}