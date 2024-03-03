import { IsNotEmpty, IsString } from "class-validator";

export class CreateTableDto {
    @IsNotEmpty({
        message: 'Mã bàn không được để trống'
    })
    @IsString({
        message: 'Mã bàn không hợp lệ'
    })
    id: string;

    @IsNotEmpty({
        message: 'Khu vực không được để trống'
    })
    area_id: number;
}