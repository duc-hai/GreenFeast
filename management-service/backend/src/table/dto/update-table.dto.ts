import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateTableDto {
    @IsOptional()
    @IsString({
        message: 'Tên bàn không hợp lệ'
    })
    name: string;

    @IsOptional()
    @IsInt({
        message: 'Mã khu vực không đúng định dạng'
    })
    area_id: number;
}