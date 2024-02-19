import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMenuDto {
    @IsNotEmpty({
        message: 'Tên món không được để trống'
    })
    @IsString({
        message: 'Tên món phải là một chuỗi'
    })
    name: string;

    @IsOptional()
    @IsString({
        message: 'Mô tả phải là một chuỗi'
    })
    description: string;

    @IsNotEmpty({
        message: 'Giá không được để trống'
    })
    @IsInt({
        message: 'Giá phải là một số hợp lệ'
    })
    price: number;

    @IsNotEmpty({
        message: 'Danh mục không được để trống',
    })
    @IsInt({
        message: 'Mã danh mục không hợp lệ'
    })
    category_id: number;

    @IsOptional()
    @IsBoolean({
        message: 'Trạng thái không hợp lệ (boolean)'
    })
    status: boolean;
}