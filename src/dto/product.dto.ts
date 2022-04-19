import { IsNotEmpty, MinLength, MaxLength } from 'class-validator'

export class ProductDto {
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(40)
    public name: string

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(50)
    public desc: string
    
    @IsNotEmpty()
    public quantity: number

    @IsNotEmpty()
    public price: number

    @IsNotEmpty()
    public image: string
}