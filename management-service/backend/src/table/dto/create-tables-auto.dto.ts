import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTableAutoDto {
    @IsNotEmpty({
        message: 'Tên viết tắt không được để trống'
    })
    @IsString({
        message: 'Tên viết tắt không hợp lệ'
    })
    shortname: string;

    @IsNotEmpty({
        message: 'Số lượng không được để trống'
    })
    quantity: number;

    @IsOptional()
    from: number;

    @IsNotEmpty({
        message: 'Khu vực không được để trống'
    })
    area_id: number;
}