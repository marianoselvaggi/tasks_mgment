import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ProductType } from '../product-type.enum';

export class ProductTypeValidationPipe implements PipeTransform {
    readonly validProductType = [
        ProductType.GAME,
        ProductType.ELECTRONICS,
        ProductType.HOUSE
    ];

    transform (value:any) {
        if(!this.isProductTypeValid(value)) {
            throw new BadRequestException(`The product type must be GAME, ElECTRONICS OR HOUSE.`);
        }
        return value;
    }

    private isProductTypeValid(value: any): boolean {
        return this.validProductType.indexOf(value) !== -1;
    }
}