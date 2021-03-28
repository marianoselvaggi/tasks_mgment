import { Transform } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ProductType } from "../product-type.enum";

export class FilterProductDto {
    @IsOptional()
    @IsNotEmpty()
    search: string;

    @Transform(value => Number(value))
    @IsOptional()
    @IsNumber()
    price: Number;

    @IsOptional()
    @IsIn([ProductType.ELECTRONICS,ProductType.GAME,ProductType.HOUSE])
    type: ProductType;
};