import { IsNotEmpty, IsNumber, IsString, Min, Max, IsInt, IsOptional } from "class-validator";

export class CreateAreaDto {
    @IsNotEmpty({
        message: 'Tên khu vực không để trống'
    })
    @IsString({
        message: 'Tên khu vực không hợp lệ'
    })
    name: string;

    //@IsNumber()
    //@IsInt()
    //@Max(100)
    //@Min(-100)
    @IsOptional()
    price_percentage: number;

    @IsOptional()
    @IsString({
        message: 'Mô tả không hợp lệ'
    })
    description: string;

    //@MinLength(5, { message: 'This field must be than 5 character' })
}