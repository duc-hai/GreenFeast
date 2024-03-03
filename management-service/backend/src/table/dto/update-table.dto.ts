import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateTableDto {
    @IsOptional()
    @IsString({
        message: 'Mã bàn không hợp lệ'
    })
    id: string;

    @IsOptional()
    @IsInt({
        message: 'Mã khu vực không đúng định dạng'
    })
    area_id: number;
}