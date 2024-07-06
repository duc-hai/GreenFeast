import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePromotionDto {
    @IsOptional()
    @IsString({
        message: 'Tên chương trình phải là một chuỗi'
    })
    name: string;

    @IsOptional()
    @IsBoolean({
        message: 'Trạng thái không hợp lệ'
    })
    status: boolean;

    @IsOptional()
    @IsString({
        message: 'Ghi chú không hợp lệ'
    })
    note: string;

    @IsOptional()
    @IsString({
        message: 'Mô tả không hợp lệ'
    })
    description: string;

    @IsOptional()
    @IsInt({
        message: 'Hình thức khuyến mãi không hợp lệ'
    })
    form_promotion: number;

    @IsOptional()
    @IsInt({
        message: 'Điều kiện áp dụng không hợp lệ'
    })
    condition_apply: number;

    @IsOptional()
    @IsString({
        message: 'Giá trị khuyến mãi không hợp lệ'
    })
    promotion_value: string;

    @IsOptional()
    auto_apply: boolean;

    @IsOptional()
    start_at: Date;

    @IsOptional()
    end_at: Date;
}