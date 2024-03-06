import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateMenuDto {
    @IsOptional()
    @IsString({
        message: 'Tên món phải là một chuỗi'
    })
    name: string;

    @IsOptional()
    @IsString({
        message: 'Mô tả phải là một chuỗi'
    })
    description: string;

    @IsOptional()
    // @IsInt({
    //     message: 'Giá phải là một số hợp lệ'
    // })
    price: number;

    @IsOptional()
    // @IsInt({
    //     message: 'Mã danh mục không hợp lệ'
    // })
    category_id: number;

    @IsOptional()
    @IsBoolean({
        message: 'Trạng thái không hợp lệ (boolean)'
    })
    status: boolean;

    @IsOptional()
    @IsIn([0, 1, 2, '0', '1', '2'], {
        message: 'Loại món không hợp lệ'
    })
    menu_type: number;
}