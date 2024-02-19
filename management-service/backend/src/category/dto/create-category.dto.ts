import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({
        message: 'Tên danh mục không được để trống'
    })
    @IsString({
        message: 'Tên danh mục không hợp lệ'
    })
    name: string;
}