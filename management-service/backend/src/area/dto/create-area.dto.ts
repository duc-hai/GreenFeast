import { IsNotEmpty, IsNumber, IsString, Min, Max, IsInt, IsOptional } from "class-validator";

export class CreateAreaDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    //@IsNumber()
    //@IsInt()
    //@Max(100)
    //@Min(-100)
    @IsOptional()
    price_percentage: number;

    @IsString()
    description: string;

    //@MinLength(5, { message: 'This field must be than 5 character' })
}