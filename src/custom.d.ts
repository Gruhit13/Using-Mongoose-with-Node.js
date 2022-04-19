//  Assign Request object of Express a new object as DTO
declare namespace Express {
    export interface Request{
        dto: any
    }
}