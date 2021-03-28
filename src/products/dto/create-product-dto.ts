import { IsIn, Length, Max, Min } from 'class-validator';
import { ProductType } from '../product-type.enum';

export class CreateProductDTO {   
    @Length(5,100,{ message: 'The title lenght must be between 5 and 10.' }) 
    title: string;
    
    @IsIn([ProductType.ELECTRONICS,ProductType.GAME,ProductType.HOUSE])
    type: ProductType;
    
    @Min(100)
    @Max(1000)
    price: Number;
}